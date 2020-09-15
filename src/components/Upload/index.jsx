import React, { Component } from 'react'
import {Upload,message,Button} from 'antd'
import {UploadOutlined} from '@ant-design/icons'
import {reqQiniuToken} from '@/api/upload'
import * as qiniu from 'qiniu-js'

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
  customRequest = async({file,onError,onProgress,onSuccess})=>{
    //创建一个上传的检测者
    const observer = {
      next({total}) {
        onProgress({percent:total.percent})
      },
      error(err){
        onError()
        // console.log('服务器记载了本次错误',err.message);
        message.error('上传失败,请联系管理员')
      },
      complete :(res)=>{
				//如果七牛最终上传成功，则调用complete
				onSuccess()
				console.log('视频地址为：','http://qgoex93ob.hn-bkt.clouddn.com/'+res.key);
				this.props.onChange('http://qgoex93ob.hn-bkt.clouddn.com/'+res.key)
				message.success('上传成功！')
			}
    }
    //此处要写一些代码，将视频交给七牛云
    const key = 'zhangshutao'+file.uid
    const {uploadToken:token} = await reqQiniuToken()
    const observable = qiniu.upload(file, key, token)
    observable.subscribe(observer) // 上传开始
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
