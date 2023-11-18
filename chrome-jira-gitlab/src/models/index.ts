export interface Project {
  id: number
  name: string
}

export interface AppConfig {
  gitlab: string
  jira: string
  projects: Project[]
  rn: number
  token: string
  issue: string
  issueName: string
  mrTitlePrefix: string
}

export interface BranchInfo {
  name: string
}

export class GitLabApi {
  url?: string
  token?: string

  private _currentUser?: number

  constructor(params: Partial<GitLabApi>) {
    Object.assign(this, params)
  }

  private apiURL() {
    return `${this.url}api/v4/`
  }

  private auth(): [[string, string]] {
    return [['PRIVATE-TOKEN', this.token ?? '']]
  }

  private parseMessage(message: { message: string | string[] }) {
    return {
      message: Array.isArray(message.message)
        ? message.message
        : [message.message],
    }
  }

  async currentUser(): Promise<number> {
    if (this._currentUser) return this._currentUser
    const result = await fetch(`${this.apiURL()}user/`, {
      headers: [...this.auth()],
    })
    const user: { id: number } = await result.json()
    this._currentUser = user.id
    return this._currentUser
  }

  async branches(params: {
    project: number
    search?: string
  }): Promise<BranchInfo[]> {
    const result = await fetch(
      `${this.apiURL()}projects/${params.project}/repository/branches${
        params.search ? `?search=${params.search}` : ''
      }`,
      { headers: [...this.auth()] }
    )
    const branches: BranchInfo[] = await result.json()
    return branches
  }

  async projects(params: { search?: string }): Promise<Project[]> {
    const result = await fetch(
      `${this.apiURL()}projects${
        params.search ? `?search=${params.search}` : ''
      }`,
      { headers: [...this.auth()] }
    )
    const branches: Project[] = await result.json()
    return branches
  }

  async createBranch(params: {
    project: number
    sourceBranch: string
    newBranch: string
  }): Promise<boolean> {
    const result = await fetch(
      `${this.apiURL()}/projects/${params.project}/repository/branches?branch=${
        params.newBranch
      }&ref=${params.sourceBranch}`,
      { headers: [...this.auth()], method: 'POST' }
    )
    if (result.status !== 200) {
      const message = this.parseMessage(await result.json())
      if (
        message.message.filter((x) => x === 'Branch already exists').length > 0
      )
        return true
      throw new Error(message.message.join(', '))
    }
    return true
  }

  async createMR(params: {
    project: number
    sourceBranch: string
    newBranch: string
    title: string
  }): Promise<boolean> {
    const result = await fetch(
      `${this.apiURL()}/projects/${params.project}/merge_requests`,
      {
        headers: [...this.auth(), ['Content-Type', 'application/json']],
        method: 'POST',
        body: JSON.stringify({
          title: params.title,
          target_branch: params.sourceBranch,
          source_branch: params.newBranch,
          assignee_id: await this.currentUser(),
          squash: true,
          remove_source_branch: true,
        }),
      }
    )
    if (result.status !== 200) {
      const message = this.parseMessage(await result.json())
      if (
        message.message.filter((x) =>
          x.includes(
            'Another open merge request already exists for this source branch'
          )
        ).length > 0
      )
        return true
      throw new Error(message.message.join(', '))
    }
    return true
  }
}
