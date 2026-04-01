import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ShowPanel from '../components/ShowPanel.vue'

const mockShow = {
  id: 1,
  name: 'Breaking Bad',
  genres: ['Drama', 'Crime'],
  rating: { average: 9.5 },
  image: { medium: 'http://example.com/bb.jpg', original: 'http://example.com/bb-orig.jpg' },
  summary: '<p>A chemistry teacher turns to crime.</p>',
  network: { name: 'AMC' },
  premiered: '2008-01-20',
  status: 'Ended',
  runtime: 47,
  language: 'English',
}

describe('ShowPanel', () => {
  it('renders nothing when show is null', () => {
    const wrapper = mount(ShowPanel, {
      props: { show: null },
      global: { stubs: { Teleport: true } },
    })
    expect(wrapper.find('.panel').exists()).toBe(false)
  })

  it('renders panel when show is provided', () => {
    const wrapper = mount(ShowPanel, {
      props: { show: mockShow },
      global: { stubs: { Teleport: true } },
    })
    expect(wrapper.find('.panel').exists()).toBe(true)
  })

  it('displays the show title', () => {
    const wrapper = mount(ShowPanel, {
      props: { show: mockShow },
      global: { stubs: { Teleport: true } },
    })
    expect(wrapper.find('.panel__title').text()).toBe('Breaking Bad')
  })

  it('displays the rating', () => {
    const wrapper = mount(ShowPanel, {
      props: { show: mockShow },
      global: { stubs: { Teleport: true } },
    })
    expect(wrapper.find('.panel__rating').text()).toContain('9.5')
  })

  it('renders genre tags', () => {
    const wrapper = mount(ShowPanel, {
      props: { show: mockShow },
      global: { stubs: { Teleport: true } },
    })
    const tags = wrapper.findAll('.panel__tag')
    expect(tags.length).toBe(2)
  })

  it('renders summary with v-html', () => {
    const wrapper = mount(ShowPanel, {
      props: { show: mockShow },
      global: { stubs: { Teleport: true } },
    })
    expect(wrapper.find('.panel__summary-text').html()).toContain('A chemistry teacher turns to crime.')
  })

  it('renders show poster image', () => {
    const wrapper = mount(ShowPanel, {
      props: { show: mockShow },
      global: { stubs: { Teleport: true } },
    })
    const img = wrapper.find('.panel__poster')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('http://example.com/bb-orig.jpg')
  })

  it('renders no-image placeholder when image is null', () => {
    const show = { ...mockShow, image: null }
    const wrapper = mount(ShowPanel, {
      props: { show },
      global: { stubs: { Teleport: true } },
    })
    expect(wrapper.find('.panel__poster').exists()).toBe(false)
    expect(wrapper.find('.panel__no-image').exists()).toBe(true)
  })

  it('emits close event when close button is clicked', async () => {
    const wrapper = mount(ShowPanel, {
      props: { show: mockShow },
      global: { stubs: { Teleport: true } },
    })
    await wrapper.find('.panel__close').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits close event when overlay is clicked', async () => {
    const wrapper = mount(ShowPanel, {
      props: { show: mockShow },
      global: { stubs: { Teleport: true } },
    })
    await wrapper.find('.panel-overlay').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('displays network name when available', () => {
    const wrapper = mount(ShowPanel, {
      props: { show: mockShow },
      global: { stubs: { Teleport: true } },
    })
    expect(wrapper.text()).toContain('AMC')
  })

  it('displays premiered date', () => {
    const wrapper = mount(ShowPanel, {
      props: { show: mockShow },
      global: { stubs: { Teleport: true } },
    })
    expect(wrapper.text()).toContain('2008-01-20')
  })

  it('does not show rating section when rating is null', () => {
    const show = { ...mockShow, rating: { average: null } }
    const wrapper = mount(ShowPanel, {
      props: { show },
      global: { stubs: { Teleport: true } },
    })
    expect(wrapper.find('.panel__rating').exists()).toBe(false)
  })
})
