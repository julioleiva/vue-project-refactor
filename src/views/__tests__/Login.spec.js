import { shallowMount } from '@vue/test-utils'
import Login from '@/views/Login.vue'
import axios from 'axios'
import { postLoginEndpoint } from '@/helpers/constants'
import { validateFields, setToken } from '@/helpers/utils'

jest.mock('axios', () => ({
  post: jest.fn()
}))

jest.mock('@/helpers/utils', () => ({
  validateFields: jest.fn(),
  setToken: jest.fn()
}))

describe('Login.vue', () => {
  let wrapper
  let mockRouter

  beforeEach(() => {
    jest.clearAllMocks()
    mockRouter = {
      push: jest.fn()
    }
  })

  const createWrapper = (options = {}) => {
    return shallowMount(Login, {
      mocks: {
        $router: mockRouter
      },
      ...options
    })
  }

  afterEach(() => {
    if (wrapper) {
      wrapper.destroy()
    }
  })

  describe('Initial Rendering', () => {
    beforeEach(() => {
      wrapper = createWrapper()
    })

    it('renders the form with initial state', () => {
      expect(wrapper.find('form').exists()).toBe(true)
      expect(wrapper.find('#form-title').text()).toBe('Please sign in')
      expect(wrapper.vm.loading).toBe(false)
      expect(wrapper.vm.error).toBe(null)
    })

    it('has empty initial form fields', () => {
      expect(wrapper.vm.username).toBe('')
      expect(wrapper.vm.password).toBe('')
    })

    it('renders logo image', () => {
      const img = wrapper.find('img')
      expect(img.exists()).toBe(true)
      expect(img.attributes('alt')).toBe('Company Logo')
    })
  })

  describe('Form Validation', () => {
    beforeEach(() => {
      wrapper = createWrapper()
    })

    it('shows error when fields are empty', async () => {
      validateFields.mockReturnValueOnce({ username: 'required', password: 'required' })
      
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.error).toBe('Please fill all required fields.')
      expect(wrapper.find('.alert-danger').exists()).toBe(true)
    })

    it('validates all required fields', async () => {
      await wrapper.setData({
        username: 'testuser',
        password: 'password123'
      })

      validateFields.mockReturnValueOnce({})
      await wrapper.find('form').trigger('submit')

      expect(validateFields).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123'
      })
    })
  })

  describe('API Interaction', () => {
    beforeEach(() => {
      wrapper = createWrapper()
    })

    it('handles successful login', async () => {
      const mockToken = 'mock-token'
      validateFields.mockReturnValueOnce({})
      axios.post.mockResolvedValueOnce({ data: { token: mockToken } })

      await wrapper.setData({
        username: 'testuser',
        password: 'password123'
      })

      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()

      expect(axios.post).toHaveBeenCalledWith(postLoginEndpoint, {
        username: 'testuser',
        password: 'password123'
      })
      expect(setToken).toHaveBeenCalledWith(mockToken)
      expect(mockRouter.push).toHaveBeenCalledWith('/')
      expect(wrapper.vm.loading).toBe(false)
    })

    it('handles login failure', async () => {
      validateFields.mockReturnValueOnce({})
      axios.post.mockRejectedValueOnce(new Error('Invalid credentials'))

      await wrapper.setData({
        username: 'testuser',
        password: 'wrongpass'
      })

      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.error).toBe('Invalid credentials. Please try again.')
      expect(wrapper.vm.loading).toBe(false)
    })

    it('shows loading state during API call', async () => {
      validateFields.mockReturnValueOnce({})
      let resolvePromise
      const promise = new Promise(resolve => { resolvePromise = resolve })
      axios.post.mockReturnValue(promise)

      await wrapper.setData({
        username: 'testuser',
        password: 'password123'
      })

      wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.loading).toBe(true)
      expect(wrapper.find('.spinner-border').exists()).toBe(true)
      expect(wrapper.find('button').attributes('disabled')).toBe('disabled')

      resolvePromise({ data: { token: 'token' } })
      await wrapper.vm.$nextTick()
    })
  })

  describe('Form Interactivity', () => {
    beforeEach(() => {
      wrapper = createWrapper()
    })

    it('updates username on input', async () => {
      const input = wrapper.find('#username')
      await input.setValue('testuser')
      expect(wrapper.vm.username).toBe('testuser')
    })

    it('updates password on input', async () => {
      const input = wrapper.find('#inputPassword')
      await input.setValue('password123')
      expect(wrapper.vm.password).toBe('password123')
    })

    it('disables submit button during loading', async () => {
      await wrapper.setData({ loading: true })
      const button = wrapper.find('button[type="submit"]')
      expect(button.attributes('disabled')).toBe('disabled')
      expect(button.attributes('aria-disabled')).toBe('true')
    })
  })

  describe('Accessibility', () => {
    beforeEach(() => {
      wrapper = createWrapper()
    })

    it('has proper form landmarks and labels', () => {
      const form = wrapper.find('form')
      expect(form.attributes('aria-labelledby')).toBe('form-title')
      expect(form.attributes('aria-describedby')).toBe('form-instructions')
    })

    it('has proper input labels and associations', () => {
      const usernameInput = wrapper.find('#username')
      const passwordInput = wrapper.find('#inputPassword')
      
      expect(wrapper.find('label[for="username"]').exists()).toBe(true)
      expect(wrapper.find('label[for="inputPassword"]').exists()).toBe(true)
      expect(usernameInput.attributes('required')).toBe('required')
      expect(passwordInput.attributes('required')).toBe('required')
    })

    it('has proper error announcement', async () => {
      await wrapper.setData({ error: 'Test error' })
      const errorAlert = wrapper.find('.alert-danger')
      expect(errorAlert.attributes('role')).toBe('alert')
      expect(errorAlert.attributes('aria-live')).toBe('polite')
    })

    it('has proper loading state indicators', async () => {
      await wrapper.setData({ loading: true })
      const spinner = wrapper.find('.spinner-border')
      expect(spinner.attributes('role')).toBe('status')
      expect(spinner.attributes('aria-hidden')).toBe('true')
    })

    it('has proper screen reader instructions', () => {
      const instructions = wrapper.find('#form-instructions')
      expect(instructions.exists()).toBe(true)
      expect(instructions.classes('sr-only')).toBe(true)
      expect(instructions.text()).toBe('Enter your username and password to access your account.')
    })
  })
})