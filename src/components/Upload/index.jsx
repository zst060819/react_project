import React, { Component } from 'react'
import {Upload,message,button, Button} from 'antd'
import {UploadOutlined} from '@ant-design/icons'

const MY_VIDEO_SIZE =1024*1024*8
export default class MyUpload extends Component {
  //视频上传之前调用,用于对上传文件做一些详细的限制
  beforeUpload = (file)=>{
    return new Promise((resolve,reject)=>{
      if (file.size <= MY_VIDEO_SIZE) {
        resolve(file)
      } else {
        reject('视频大小超过8MB!')
        message.warning('视频大小不得超过8MB')
      }
    })
  }
	//用于编写自定义上传的逻辑
  customRequest = ()=>{
    	//此处要写一些代码，将视频交给七牛云
  }
  render() {
    return (
      <Upload
        accept='video/mp4'
        beforeUpload={this.beforeUpload}
        customRequest={this.customRequest}
      >
        <Button icon={<UploadOutlined/>}>点击上传</Button>
      </Upload>
    )
  }
}
