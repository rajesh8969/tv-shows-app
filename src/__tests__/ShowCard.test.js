import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ShowCard from '../components/ShowCard.vue'

const baseShow = {
  id: 1,
  name: 'Breaking Bad',
  genres: ['Drama', 'Crime', 'Thriller'],
  rating: { average: 9.5 },
  image: { medium: 'http://example.com/bb.jpg', original: 'http://example.com/bb-orig.jpg' },
  summary: '<p>A great show.</p>',
}

describe('ShowCard', () => {
  it('renders the show title', () => {
    const wrapper = mount(ShowCard, { props: { show: baseShow } })
    expect(wrapper.text()).toContain('Breaking Bad')
  })

  it('renders the rating when available', () => {
    const wrapper = mount(ShowCard, { props: { show: baseShow } })
    expect(wrapper.text()).toContain('9.5')
  })

  it('renders genre tags (max 2)', () => {
    const wrapper = mount(ShowCard, { props: { show: baseShow } })
    const tags = wrapper.findAll('.show-card__genre-tag')
    expect(tags.length).toBe(2)
    expect(tags[0].text()).toBe('Drama')
    expect(tags[1].text()).toBe('Crime')
  })

  it('renders poster image when image is present', () => {
    const wrapper = mount(ShowCard, { props: { show: baseShow } })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('http://example.com/bb.jpg')
    expect(img.attributes('alt')).toBe('Breaking Bad')
  })

  it('renders no-image placeholder when image is null', () => {
    const show = { ...baseShow, image: null }
    const wrapper = mount(ShowCard, { props: { show } })
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.show-card__no-image').exists()).toBe(true)
  })

  it('does not render rating badge when rating is null', () => {
    const show = { ...baseShow, rating: { average: null } }
    const wrapper = mount(ShowCard, { props: { show } })
    expect(wrapper.find('.show-card__rating').exists()).toBe(false)
  })

  it('does not render rating badge when rating is missing', () => {
    const show = { ...baseShow, rating: null }
    const wrapper = mount(ShowCard, { props: { show } })
    expect(wrapper.find('.show-card__rating').exists()).toBe(false)
  })

  it('emits select event with show data when clicked', async () => {
    const wrapper = mount(ShowCard, { props: { show: baseShow } })
    await wrapper.find('.show-card').trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')[0][0]).toEqual(baseShow)
  })

  it('does not render genre tags section when genres is empty', () => {
    const show = { ...baseShow, genres: [] }
    const wrapper = mount(ShowCard, { props: { show } })
    expect(wrapper.find('.show-card__genres').exists()).toBe(false)
  })
})
