// add this to your setupFilesAfterEnv config in jest so it's imported for every test file
import mockData from './mockdata.json'

async function mockFetch (url, config) {
  switch (url) {
    case 'https://poe.ninja/api/data/itemoverview?league=Ancestor&type=SkillGem': {
      const user = await users.login(JSON.parse(config.body))
      return {
        ok: true,
        status: 200,
        json: async () => ({ mockData }),
      }
    }
    case '/login': {
      const user = await users.login(JSON.parse(config.body))
      return {
        ok: true,
        status: 200,
        json: async () => ({ user }),
      }
    }
    case '/checkout': {
      const isAuthorized = user.authorize(config.headers.Authorization)
      if (!isAuthorized) {
        return Promise.reject({
          ok: false,
          status: 401,
          json: async () => ({ message: 'Not authorized' }),
        })
      }
      const shoppingCart = JSON.parse(config.body)
      // do whatever other things you need to do with this shopping cart
      return {
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      }
    }
    default: {
      throw new Error(`Unhandled request: ${url}`)
    }
  }
}

beforeAll(() => jest.spyOn(window, 'fetch'))
beforeEach(() => window.fetch.mockImplementation(mockFetch))