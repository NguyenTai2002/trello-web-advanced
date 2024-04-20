import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'

import { API_ROOT } from '~/utils/constants'
// khởi tạo giá trị state của một Slice trong redux
const initialState = {
  currentUser: null
}

// Các hành động gọi api thì dùng createAsyncThunk (middleware) cùng với extraReducers

export const loginUserAPI = createAsyncThunk(
  // name = sliceName +
  'user/loginUserAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/login`, data)
    // Lưu ý: axios sẽ trả kết quả về qua property của nó là data
    return response.data
  }
)

// Khởi tạo một Slice trong redux-store
export const userSlice = createSlice({
  name: 'user',
  initialState,
  // Reducers: nơi xử lý dữ liệu đồng bộ
  reducers: { },
  // ExtraReducers: xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      // action.payload = response.data from loginUserAPI
      const user = action.payload

      state.currentUser = user
    })
  }
})

// ACtions: là nơi dành cho các components bên dưới gọi bằng dispatch() tới dể cập nhật lại dữ liệu thông qua reducer (đồng bộ)
// Action creators are generated for each case reducer function
// export const { updateCurrentActiveBoard } = activeBoardSlice.actions


// Selectors là nơi dành cho các component bên dưới gọi bằng hook useSelector() để lấy dữ liệu trong redux store
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}


export const userReducer = userSlice.reducer