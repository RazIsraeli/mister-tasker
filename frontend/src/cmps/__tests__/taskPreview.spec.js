// import { expectTypeOf } from 'vitest'
// import { describe, it, expect } from 'vitest'
// import { vi } from 'vitest' // mocking services - remember to clean between uses

import { mount } from '@vue/test-utils'

//import cmp to test
import taskPreview from '../task-preview.vue'

//describe test suite for cmp
describe('task preview renders properly', () => {
  it('preview section is rendered" ', () => {
    // Arrange

    const task = {
      id: 't101',
      title: 'Fix performance issues',
      importance: 2,
      status: 'new',
      triesCount: 0,
    }

    const wrapper = mount(taskPreview, { props: { task } })
    expect(wrapper).toBeTruthy()
    //validating task details to display
    const title = wrapper.find('h2')
    expect(title.text()).toBe('Title: ' + task.title)
  })

  // getApples()

  // expect(getApples).toHaveBeenCalled()
  // expect(getApples).toHaveReturnedWith(0)

  // getApples.mockReturnValueOnce(5)

  // const res = getApples()
  // expect(res).toBe(5)
  // expect(getApples).toHaveNthReturnedWith(2, 5)

  // const elRouter = wrapper.find('h2')
  // expect(elRouter.text()).toBe('hello')
})

// it('Only fast cars have the "fast" class', () => {
//   const car = carService.getEmptyCar('TestCar1', 201)
//   var wrapper = mount(CarPreview, {
//     props: {
//       car,
//     },
//   })
//   var el = wrapper.find('h3')
//   expect(el.classes('fast')).toBe(true)
// })
