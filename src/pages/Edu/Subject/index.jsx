import React, { Component } from 'react'
//引入antd的Card、Button组件
import {Card,Button,Table} from 'antd'
//引入图标
import {PlusCircleOutlined,FormOutlined,DeleteOutlined} from '@ant-design/icons'
//引入less
import './index.less'



export default class Subject extends Component {
	render() {
		//dataSource是表格的数据源，后期一定是由于服务器返回
		const dataSource = [
			{
				key: '1', //每条数据的唯一标识
				name: '课程列表一',
			},
			{
				key: '2',//每条数据的唯一标识
				name: '课程列表二',
			},
		];
		//columns是表格的列配置（重要）
		const columns = [
			{
				title: '课程列表', //列名
				dataIndex: 'name', //数据索引项
        key: '0',
        
			},
			{
				title: '操作',
				dataIndex: 'age',
        key: '1',
        render:()=>(
          <>
            <Button className='left_but' type='primary' icon={<FormOutlined/>}></Button>
            <Button type='danger' icon={<DeleteOutlined/>}></Button>
          </>)
        
			},
		];
		return (
			<Card 
				title={
					<Button type="primary" icon={<PlusCircleOutlined/>}>
						新增分类
					</Button>
				}
			>
				<Table dataSource={dataSource} columns={columns} />
			</Card>
		)
	}
}
