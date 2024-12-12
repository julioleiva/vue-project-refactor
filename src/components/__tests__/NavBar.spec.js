import { shallowMount } from '@vue/test-utils'
import Navbar from '@/components/NavBar.vue'
import { Tooltip } from 'bootstrap'

jest.mock('bootstrap', () => ({
  Tooltip: jest.fn()
}))

describe('Navbar.vue', () => {
  let wrapper

  const createWrapper = (options = {}) => {
    return shallowMount(Navbar, {
      propsData: {
        title: 'Test Title',
        showLogout: true,
        ...options.propsData
      },
      slots: {
        default: '<div class="test-slot">Test Slot</div>',
        ...options.slots
      },
      ...options
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
    document.querySelectorAll = jest.fn().mockReturnValue([])
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.destroy()
    }
  })

  describe('Rendering', () => {
    it('renders with default props', () => {
      wrapper = createWrapper({
        propsData: {
          title: undefined,
          showLogout: undefined
        }
      })
      expect(wrapper.find('nav').exists()).toBe(true)
      expect(wrapper.find('.navbar-brand').text()).toBe('Navbar')
      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('renders with custom title', () => {
      wrapper = createWrapper({
        propsData: {
          title: 'Custom Title'
        }
      })
      expect(wrapper.find('.navbar-brand').text()).toBe('Custom Title')
    })

    it('renders slot content when provided', () => {
      wrapper = createWrapper()
      expect(wrapper.find('.test-slot').exists()).toBe(true)
      expect(wrapper.find('.test-slot').text()).toBe('Test Slot')
    })

    it('hides logout button when showLogout is false', () => {
      wrapper = createWrapper({
        propsData: {
          showLogout: false
        }
      })
      expect(wrapper.find('button').exists()).toBe(false)
    })
  })

  describe('Events', () => {
    it('emits logout event when button is clicked', async () => {
      wrapper = createWrapper()
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted('logout')).toBeTruthy()
      expect(wrapper.emitted('logout')).toHaveLength(1)
    })
  })

  describe('Bootstrap Tooltip', () => {
    it('initializes tooltip on mount', () => {
      const mockElement = document.createElement('button')
      document.querySelectorAll = jest.fn().mockReturnValue([mockElement])
      
      wrapper = createWrapper()
      
      expect(document.querySelectorAll).toHaveBeenCalledWith('[data-bs-toggle="tooltip"]')
      expect(Tooltip).toHaveBeenCalledWith(mockElement, {
        trigger: 'hover'
      })
    })
  })

  describe('Accessibility', () => {
    beforeEach(() => {
      wrapper = createWrapper()
    })

    it('has correct navigation role and label', () => {
      const nav = wrapper.find('nav')
      expect(nav.attributes('role')).toBe('navigation')
      expect(nav.attributes('aria-label')).toBe('Main Navigation')
    })

    it('has focusable navbar brand', () => {
      expect(wrapper.find('.navbar-brand').attributes('tabindex')).toBe('0')
    })

    it('has accessible logout button', () => {
      const button = wrapper.find('button')
      expect(button.attributes('aria-label')).toBe('Log out of your account')
      expect(button.attributes('title')).toBe('Logout')
    })

    it('has screen reader text for logout', () => {
      expect(wrapper.find('.sr-only').exists()).toBe(true)
      expect(wrapper.find('.sr-only').text()).toBe('Logout')
    })

    it('has decorative icon', () => {
      const icon = wrapper.find('i')
      expect(icon.attributes('aria-hidden')).toBe('true')
    })
  })

  describe('Props Validation', () => {
    it('validates title prop', () => {
      const { title } = wrapper.vm.$options.props
      expect(title.type).toBe(String)
      expect(title.default).toBe('Navbar')
    })

    it('validates showLogout prop', () => {
      const { showLogout } = wrapper.vm.$options.props
      expect(showLogout.type).toBe(Boolean)
      expect(showLogout.default).toBe(true)
    })
  })

  describe('Bootstrap Classes', () => {
    it('applies correct navbar classes', () => {
      wrapper = createWrapper()
      const nav = wrapper.find('nav')
      expect(nav.classes()).toContain('navbar')
      expect(nav.classes()).toContain('navbar-expand-lg')
      expect(nav.classes()).toContain('navbar-light')
      expect(nav.classes()).toContain('bg-light')
      expect(nav.classes()).toContain('mb-4')
    })

    it('applies correct button classes', () => {
      wrapper = createWrapper()
      const button = wrapper.find('button')
      expect(button.classes()).toContain('btn')
      expect(button.classes()).toContain('btn-outline-danger')
      expect(button.classes()).toContain('d-flex')
      expect(button.classes()).toContain('align-items-center')
    })
  })
})