export default {
  methods: {
    submitImages({
      uploadUrl,
      filePaths,
      formData
    }) {
      return Promise.all(filePaths.map((filePath) => {
        return this.submitImage({
          uploadUrl,
          filePath,
          formData
        })
      }))
    },
    submitImage({
      uploadUrl,
      filePath,
      formData
    }) {
      return new Promise((resolve, reject) => {
        wx.uploadFile({
          url: uploadUrl,
          name: 'file',
          header: {
            'content-type': 'multipart/form-data',
            sessionId: wx.getStorageSync('sessionId')
          },
          filePath: filePath,
          formData: formData,
          success: res => {
            console.log('success', res);

            // if(res.statusCode==200){
            try {
              var resData = JSON.parse(res.data);
              resolve(resData)
            } catch (e) {
              console.error('e', e)
              reject(e)
            }
            // }
            resolve(res)
          },
          fail: res => {
            console.log('fail', res);
            reject(res);
          },
          complete: res => {
            console.log('complete', res);
          }
        });
      })
    }
  }
}
