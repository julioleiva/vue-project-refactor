import { shallowMount } from '@vue/test-utils'
import ProductsList from '@/views/ProductsList.vue'
import Navbar from '@/components/NavBar.vue'
import ProductCard from '@/components/ProductCard.vue'
import axios from 'axios'
import { getProductsListEndpoint } from '@/helpers/constants'
import { toggleFavorite, clearToken } from '@/helpers/utils'

jest.mock('axios', () => ({
  get: jest.fn()
}))

jest.mock('@/helpers/utils', () => ({
  toggleFavorite: jest.fn(),
  clearToken: jest.fn()
}))

describe('ProductsList.vue', () => {
  let wrapper
  let mockRouter

  const mockProducts = [
    { id: 1, title: 'Product 1', price: 100, favorite: false },
    { id: 2, title: 'Product 2', price: 200, favorite: false }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    mockRouter = { push: jest.fn() }

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'fake-token'),
        setItem: jest.fn(),
        removeItem: jest.fn()
      },
      writable: true
    })
  })

  const createWrapper = (options = {}) => {
    return shallowMount(ProductsList, {
      mocks: {
        $router: mockRouter
      },
      stubs: {
        Navbar: true,
        ProductCard: true
      },
      data() {
        return {
          products: [],
          loading: true,
          error: null,
          ...options.data
        }
      },
      ...options
    })
  }

  afterEach(() => {
    if (wrapper) {
      wrapper.destroy()
    }
    jest.resetModules()
    jest.clearAllMocks()
  })

  describe('Initial Rendering', () => {
    it('shows loading state initially', () => {
      wrapper = createWrapper()
      const loading = wrapper.find('.loading')
      expect(loading.exists()).toBe(true)
      expect(loading.text()).toBe('Loading...')
    })

    it('renders Navbar component', () => {
      wrapper = createWrapper()
      expect(wrapper.findComponent({ name: 'Navbar' }).exists()).toBe(true)
    })
  })

  describe('Authentication', () => {
    it('redirects to login if no token exists', () => {
      window.localStorage.getItem.mockReturnValueOnce(null)
      wrapper = createWrapper()
      expect(mockRouter.push).toHaveBeenCalledWith('/login')
    })

    it('does not redirect if token exists', async () => {
      window.localStorage.getItem.mockReturnValueOnce('fake-token')
      wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      expect(mockRouter.push).not.toHaveBeenCalled()
    })
  })

  describe('Products Fetching', () => {
    beforeEach(() => {
      axios.get.mockReset()
    })

    it('fetches and displays products successfully', async () => {
      const responseData = { data: mockProducts }
      axios.get.mockImplementation(() => Promise.resolve(responseData))
      wrapper = createWrapper()

      await wrapper.vm.fetchProducts()
      await wrapper.vm.$nextTick()
      
      expect(axios.get).toHaveBeenCalledWith(getProductsListEndpoint)
      expect(wrapper.vm.products).toEqual(mockProducts)
      expect(wrapper.vm.loading).toBe(false)
      expect(wrapper.vm.error).toBe(null)
    })

    it('handles empty products array', async () => {
      const responseData = { data: [] }
      axios.get.mockImplementation(() => Promise.resolve(responseData))
      wrapper = createWrapper()

      await wrapper.vm.fetchProducts()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.products).toEqual([])
      expect(wrapper.vm.loading).toBe(false)
      expect(wrapper.vm.error).toBe(null)
      expect(wrapper.find('.no-products').exists()).toBe(true)
      expect(wrapper.find('.no-products').text()).toBe('No products available.')
    })

    it('handles API errors', async () => {
      const error = new Error('API Error')
      axios.get.mockImplementation(() => Promise.reject(error))
      wrapper = createWrapper()

      await wrapper.vm.fetchProducts()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.error).toBe('Failed to load products.')
      expect(wrapper.vm.loading).toBe(false)
      expect(wrapper.find('.error').exists()).toBe(true)
    })
  })

  describe('Product Interactions', () => {
    beforeEach(async () => {
      const responseData = { data: mockProducts }
      axios.get.mockImplementation(() => Promise.resolve(responseData))
      wrapper = createWrapper()
      await wrapper.vm.fetchProducts()
      await wrapper.vm.$nextTick()
    })

    it('toggles product favorite status', async () => {
      const productId = 1
      const updatedProducts = [...mockProducts]
      toggleFavorite.mockReturnValueOnce(updatedProducts)

      await wrapper.vm.toggleProductFavorite(productId)
      await wrapper.vm.$nextTick()

      expect(toggleFavorite).toHaveBeenCalledWith(wrapper.vm.products, productId)
    })

    it('handles product-favorite-clicked event', async () => {
      wrapper.vm.toggleProductFavorite = jest.fn()
      const productId = 1

      const productCard = wrapper.findComponent(ProductCard)
      productCard.vm.$emit('product-favorite-clicked', productId)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.toggleProductFavorite).toHaveBeenCalledWith(productId)
    })

    it('handles keyboard interaction', async () => {
      wrapper.vm.toggleProductFavorite = jest.fn()
      const productId = 1

      await wrapper.find('.product-item').trigger('keyup.enter')
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.toggleProductFavorite).toHaveBeenCalledWith(productId)
    })
  })

  describe('Logout Functionality', () => {
    beforeEach(() => {
      wrapper = createWrapper()
    })

    it('handles logout click', async () => {
      await wrapper.vm.logout()
      await wrapper.vm.$nextTick()
      
      expect(clearToken).toHaveBeenCalled()
      expect(mockRouter.push).toHaveBeenCalledWith('/login')
    })

    it('handles navbar logout event', async () => {
      const navbar = wrapper.findComponent(Navbar)
      await navbar.vm.$emit('logout')
      
      expect(clearToken).toHaveBeenCalled()
      expect(mockRouter.push).toHaveBeenCalledWith('/login')
    })
  })

  describe('Accessibility', () => {
    beforeEach(async () => {
      const responseData = { data: mockProducts }
      axios.get.mockImplementation(() => Promise.resolve(responseData))
      wrapper = createWrapper()
      await wrapper.vm.fetchProducts()
      await wrapper.vm.$nextTick()
    })

    it('has proper ARIA landmarks', () => {
      expect(wrapper.find('[role="main"]').exists()).toBe(true)
      expect(wrapper.find('#products-title').exists()).toBe(true)
    })


    it('has correct error state attributes', async () => {
      await wrapper.setData({ error: 'Test error' })
      await wrapper.vm.$nextTick()

      const error = wrapper.find('.error')
      expect(error.attributes('role')).toBe('alert')
      expect(error.attributes('aria-live')).toBe('assertive')
    })

    it('provides accessible product labels', () => {
      const productItem = wrapper.find('.product-item')
      expect(productItem.attributes('aria-label')).toContain('Product:')
      expect(productItem.attributes('aria-label')).toContain('Price:')
    })
  })
})