import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchBar from '../components/SearchBar.vue'

describe('SearchBar', () => {
  it('renders an input element', () => {
    const wrapper = mount(SearchBar, { props: { modelValue: '' } })
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('input has correct placeholder', () => {
    const wrapper = mount(SearchBar, { props: { modelValue: '' } })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Search TV shows...')
  })

  it('displays the modelValue in the input', () => {
    const wrapper = mount(SearchBar, { props: { modelValue: 'breaking' } })
    expect(wrapper.find('input').element.value).toBe('breaking')
  })

  it('shows clear button when modelValue is non-empty', () => {
    const wrapper = mount(SearchBar, { props: { modelValue: 'test' } })
    expect(wrapper.find('.search-bar__clear').exists()).toBe(true)
  })

  it('does not show clear button when modelValue is empty', () => {
    const wrapper = mount(SearchBar, { props: { modelValue: '' } })
    expect(wrapper.find('.search-bar__clear').exists()).toBe(false)
  })

  it('emits clear event when clear button is clicked', async () => {
    const wrapper = mount(SearchBar, { props: { modelValue: 'test' } })
    await wrapper.find('.search-bar__clear').trigger('click')
    expect(wrapper.emitted('clear')).toBeTruthy()
  })

  it('emits clear event when Escape key is pressed', async () => {
    const wrapper = mount(SearchBar, { props: { modelValue: 'test' } })
    await wrapper.find('input').trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('clear')).toBeTruthy()
  })

  it('has aria-label on input', () => {
    const wrapper = mount(SearchBar, { props: { modelValue: '' } })
    expect(wrapper.find('input').attributes('aria-label')).toBe('Search TV shows')
  })
})
