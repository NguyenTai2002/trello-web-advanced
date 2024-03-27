import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { isEmpty } from 'lodash'
import { API_ROOT } from '~/utils/constants'
import { generatePlaceholderCard } from '~/utils/formatters'
import { mapOrder } from '~/utils/sorts'
// khởi tạo giá trị state của một Slice trong redux
const initialState = {
  currentActiveBoard: null
}

// Các hành động gọi api thì dùng createAsyncThunk (middleware) cùng với extraReducers

export const fetchBoardDetailsAPI = createAsyncThunk(
  // name = sliceName + 
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
    // Lưu ý: axios sẽ trả kết quả về qua property của nó là data
    return response.data
  }
)

// Khởi tạo một Slice trong redux-store
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // Reducers: nơi xử lý dữ liệu đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, ở đây được gán vào biến fullBoard
      const fullBoard = action.payload
      // update lại dữ liệu của currentActiveBoard

      state.currentActiveBoard = fullBoard
    }
  },
  // ExtraReducers: xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      // action.payload = response.data from fetchBoardDetailsAPI
      let board = action.payload

      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })

      state.currentActiveBoard = board
    })
  }
})

// ACtions: là nơi dành cho các components bên dưới gọi bằng dispatch() tới dể cập nhật lại dữ liệu thông qua reducer (đồng bộ)
// Action creators are generated for each case reducer function
export const { updateCurrentActiveBoard } = activeBoardSlice.actions


// Selectors là nơi dành cho các component bên dưới gọi bằng hook useSelector() để lấy dữ liệu trong redux store
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

// Tên file là activeBoardSlice, NHƯNG export default phải export ra một reducer để bên store dùng

// export default activeBoardSlice.reducer

export const activeBoardReducer = activeBoardSlice.reducer