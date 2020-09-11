import React, { Component } from 'react'
//引入antd的Card、Button组件
import { Card, Button, Table } from 'antd'
//引入图标
import { PlusCircleOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons'
//引入reqNo1SubjectPagination发送请求
import { reqNo1SubjectPagination,reqAllNo2SubjectByNo1Id } from '@/api/edu/subject'
//引入样式
import './index.less'


export default class Subject extends Component {

	state = {
		no1SubjectInfo: { //存储一级分类数据
			items: [],//当前页的一级分类数据
			total: 0 //数据总数
		},
		pageSize: 3, //页大小
		expandedRowKeys: [], //展开了的一级分类id数组
	}

	//根据：页码、页大小请求对应数据
	getNo1SubjectPagination = async (page, pageSize = this.state.pageSize) => {
		let { items, total } = await reqNo1SubjectPagination(page, pageSize)
		//加工请求回来的一级分类数组,给每一项都加children属性
		items = items.map(no1Subject => ({ ...no1Subject, children:[] }))
		//维护状态
		this.setState({
			no1SubjectInfo: { items, total },
			pageSize,
			expandedRowKeys:[]
		})
	}
	//点击展开按钮的回调
	handleExpand = async (expandedIds) => {
		const { expandedRowKeys, no1SubjectInfo } = this.state
		//如果是展开
		if (expandedRowKeys.length < expandedIds.length) {
			//获取当前展开项的id
			const currentId = expandedIds.slice(-1)[0]
			//获取当前展开项
			const currentSubject = no1SubjectInfo.items.find(sub => sub._id === currentId)
			//获得当前展开项的id
			if (!currentSubject.children.length) {
				//请求数据
				const result = await reqAllNo2SubjectByNo1Id(currentId)
				//获取二级分类数组
				const { items } = result
				//给指定一级分类追加children数据
				const formatedNo1Items = no1SubjectInfo.items.map((no1Subject) => {
					//如果当前展开的分类
					if (no1Subject._id === currentId) {
						no1Subject.children = items
						if (!items.length) delete no1Subject.children
					}
					return no1Subject
				})
				//维护状态
				this.setState({
					//更新一节分类数据
					no1SubjectInfo: { ...no1SubjectInfo, items: formatedNo1Items },
				})
			}
		}
		this.setState({ expandedRowKeys: expandedIds })
	}

	componentDidMount() {
		//初始化第一页数据
		this.getNo1SubjectPagination(1)
	}

	render() {
		//从状态中获取所有一级分类数据
		const { no1SubjectInfo: { total, items }, pageSize } = this.state
		//columns是表格的列配置（重要）
		const columns = [
			{
				title: '分类名', //列名
				dataIndex: 'title', //数据索引项
				key: '0',
				width: '80%'
			},
			{
				title: '操作',
				dataIndex: 'name',
				key: '1',
				align: 'center',
				render: () => (
					<>
						<Button className="left_btn" type="primary" icon={<FormOutlined />}></Button>
						<Button type="danger" icon={<DeleteOutlined />}></Button>
					</>
				)
			},
			/* 
					1.render和dataIndex同时存在的时候，以render为主。
					2.render接收到的参数，由dataIndex控制,dataIndex若不写，则传递当前数据项所有内容
			*/
		];
		return (
			<Card
				title={
					<Button type="primary" icon={<PlusCircleOutlined />}>
						新增分类
					</Button>
				}
			>
				<Table
					dataSource={items}
					columns={columns}
					rowKey="_id"
					expandable={{
						// expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
						// rowExpandable: record => record.name !== 'Not Expandable',
						onExpandedRowsChange:this.handleExpand,//展开的回调 --- 传入：处于展开状态的id数组
						expandedRowKeys //告诉Table展开了哪些项
					}}
					pagination={{
						pageSize,
						total,
						showSizeChanger: true,
						pageSizeOptions: ['3', '5', '8', '10'],
						onChange: this.getNo1SubjectPagination,
						onShowSizeChange: (_, pageSize) => { this.getNo1SubjectPagination(1, pageSize) }
					}}
				/>
			</Card>
		)
	}
}
