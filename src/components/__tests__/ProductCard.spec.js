import { shallowMount, mount } from '@vue/test-utils'
import Navbar from '@/components/NavBar.vue'
import { Tooltip } from 'bootstrap'

jest.mock('bootstrap', () => ({
  Tooltip: jest.fn()
}))

describe('Navbar.vue', () => {
  let wrapper

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('Rendering', () => {
    it('renders with default props', () => {
      wrapper = shallowMount(Navbar)
      
      expect(wrapper.find('nav').exists()).toBe(true)
      expect(wrapper.find('.navbar-brand').text()).toBe('Navbar')
      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('renders with custom title', () => {
      wrapper = shallowMount(Navbar, {
        propsData: {
          title: 'Custom Title'
        }
      })
      
      expect(wrapper.find('.navbar-brand').text()).toBe('Custom Title')
    })

    it('does not show logout button when showLogout is false', () => {
      wrapper = shallowMount(Navbar, {
        propsData: {
          showLogout: false
        }
      })
      
      expect(wrapper.find('button').exists()).toBe(false)
    })

    it('renders slot content when provided', () => {
      wrapper = shallowMount(Navbar, {
        slots: {
          default: '<div class="test-slot">Slot Content</div>'
        }
      })
      
      expect(wrapper.find('.test-slot').exists()).toBe(true)
      expect(wrapper.find('.test-slot').text()).toBe('Slot Content')
    })
  })

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      wrapper = shallowMount(Navbar)
      
      const nav = wrapper.find('nav')
      expect(nav.attributes('role')).toBe('navigation')
      expect(nav.attributes('aria-label')).toBe('Main Navigation')
      
      const logoutBtn = wrapper.find('button')
      expect(logoutBtn.attributes('aria-label')).toBe('Log out of your account')
    })

    it('has focusable navbar brand', () => {
      wrapper = shallowMount(Navbar)
      
      const brand = wrapper.find('.navbar-brand')
      expect(brand.attributes('tabindex')).toBe('0')
    })

    it('has proper screen reader text for logout button', () => {
      wrapper = shallowMount(Navbar)
      
      expect(wrapper.find('.sr-only').text()).toBe('Logout')
    })

    it('marks icon as decorative', () => {
      wrapper = shallowMount(Navbar)
      
      const icon = wrapper.find('i')
      expect(icon.attributes('aria-hidden')).toBe('true')
    })
  })

  describe('Bootstrap Tooltip', () => {
    beforeEach(() => {
      document.querySelectorAll = jest.fn().mockReturnValue([
        document.createElement('button')
      ])
    })

    it('initializes tooltip on mount', () => {
      wrapper = mount(Navbar)
      
      expect(document.querySelectorAll).toHaveBeenCalledWith('[data-bs-toggle="tooltip"]')
      expect(Tooltip).toHaveBeenCalled()
      
      const tooltipOptions = Tooltip.mock.calls[0][1]
      expect(tooltipOptions.trigger).toBe('hover')
    })
  })

  describe('Events', () => {
    it('emits logout event when logout button is clicked', async () => {
      wrapper = shallowMount(Navbar)
      
      await wrapper.find('button').trigger('click')
      
      expect(wrapper.emitted().logout).toBeTruthy()
      expect(wrapper.emitted().logout.length).toBe(1)
    })
  })

  describe('Props Validation', () => {
    it('validates title prop type', () => {
      const { title } = wrapper.vm.$options.props
      
      expect(title.type).toBe(String)
      expect(title.default).toBe('Navbar')
    })

    it('validates showLogout prop type', () => {
      const { showLogout } = wrapper.vm.$options.props
      
      expect(showLogout.type).toBe(Boolean)
      expect(showLogout.default).toBe(true)
    })
  })

  describe('Style Classes', () => {
    it('applies correct bootstrap classes', () => {
      wrapper = shallowMount(Navbar)
      
      expect(wrapper.classes()).toContain('navbar')
      expect(wrapper.classes()).toContain('navbar-expand-lg')
      expect(wrapper.classes()).toContain('navbar-light')
      expect(wrapper.classes()).toContain('bg-light')
      expect(wrapper.classes()).toContain('mb-4')
    })

    it('includes container-fluid class', () => {
      wrapper = shallowMount(Navbar)
      
      expect(wrapper.find('.container-fluid').exists()).toBe(true)
    })

    it('applies correct button classes', () => {
      wrapper = shallowMount(Navbar)
      
      const button = wrapper.find('button')
      expect(button.classes()).toContain('btn')
      expect(button.classes()).toContain('btn-outline-danger')
      expect(button.classes()).toContain('d-flex')
      expect(button.classes()).toContain('align-items-center')
    })
  })
})