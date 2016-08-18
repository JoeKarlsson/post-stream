export const setItems = (data) => {
  dispatch({
    type: 'set_items',
    data: data
  })
};