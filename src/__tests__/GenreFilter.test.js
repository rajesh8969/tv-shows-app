import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GenreFilter from '../components/GenreFilter.vue'

const genres = ['All', 'Drama', 'Comedy', 'Action']

describe('GenreFilter', () => {
  it('renders all genre buttons', () => {
    const wrapper = mount(GenreFilter, {
      props: { genres, activeGenre: 'All' },
    })
    const buttons = wrapper.findAll('.genre-filter__btn')
    expect(buttons.length).toBe(4)
    expect(buttons[0].text()).toBe('All')
    expect(buttons[1].text()).toBe('Drama')
  })

  it('applies active class to the active genre button', () => {
    const wrapper = mount(GenreFilter, {
      props: { genres, activeGenre: 'Drama' },
    })
    const buttons = wrapper.findAll('.genre-filter__btn')
    expect(buttons[0].classes()).not.toContain('active')
    expect(buttons[1].classes()).toContain('active')
  })

  it('emits select event with genre name when a button is clicked', async () => {
    const wrapper = mount(GenreFilter, {
      props: { genres, activeGenre: 'All' },
    })
    const buttons = wrapper.findAll('.genre-filter__btn')
    await buttons[2].trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')[0][0]).toBe('Comedy')
  })

  it('has correct aria-pressed attribute on active button', () => {
    const wrapper = mount(GenreFilter, {
      props: { genres, activeGenre: 'Comedy' },
    })
    const buttons = wrapper.findAll('.genre-filter__btn')
    expect(buttons[2].attributes('aria-pressed')).toBe('true')
    expect(buttons[0].attributes('aria-pressed')).toBe('false')
  })

  it('renders nothing when genres is empty', () => {
    const wrapper = mount(GenreFilter, {
      props: { genres: [], activeGenre: 'All' },
    })
    expect(wrapper.findAll('.genre-filter__btn').length).toBe(0)
  })
})
