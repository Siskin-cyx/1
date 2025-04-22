import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plane, 
  Calendar, 
  User, 
  Ticket, 
  ArrowUpRight,
  ArrowDownLeft,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Users,
  Home,
  List,
  X,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AMapLoader from '@amap/amap-jsapi-loader';

const FlightBookingSystem = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchParams, setSearchParams] = useState<{ start: string; end: string; day: string }>({
    start: '',
    end: '',
    day: ''
  });
  const [bookingParams, setBookingParams] = useState<{ flightId: string; name: string; idNum: string; day: string; numTickets: number; grade: number }>({
    flightId: '',
    name: '',
    idNum: '',
    day: '',
    numTickets: 1,
    grade: 1
  });
  const [returnParams, setReturnParams] = useState<{ flightId: string; idNum: string }>({
    flightId: '',
    idNum: ''
  });
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [returnSuccess, setReturnSuccess] = useState(false);

  // 航班数据
  const flightData = [
    { qidian: "上海", zhongdian: "北京", hbID: "1", hbnum: "A1111", day: "星期一", maxnum: 200, less: 200, lessgrade1: 90, lessgrade2: 110 },
    { qidian: "北京", zhongdian: "武汉", hbID: "2", hbnum: "B8942", day: "星期二", maxnum: 200, less: 200, lessgrade1: 100, lessgrade2: 100 },
    { qidian: "武汉", zhongdian: "广州", hbID: "3", hbnum: "C5465", day: "星期三", maxnum: 200, less: 200, lessgrade1: 100, lessgrade2: 100 },
    { qidian: "广州", zhongdian: "深圳", hbID: "4", hbnum: "D5645", day: "星期四", maxnum: 200, less: 200, lessgrade1: 100, lessgrade2: 100 },
    { qidian: "深圳", zhongdian: "长沙", hbID: "5", hbnum: "E4986", day: "星期一", maxnum: 200, less: 200, lessgrade1: 100, lessgrade2: 100 },
    { qidian: "长沙", zhongdian: "成都", hbID: "6", hbnum: "F6545", day: "星期三", maxnum: 200, less: 200, lessgrade1: 100, lessgrade2: 100 },
    { qidian: "成都", zhongdian: "郑州", hbID: "7", hbnum: "G3993", day: "星期二", maxnum: 200, less: 200, lessgrade1: 100, lessgrade2: 100 },
    { qidian: "郑州", zhongdian: "南京", hbID: "8", hbnum: "H6533", day: "星期一", maxnum: 200, less: 200, lessgrade1: 100, lessgrade2: 100 },
    { qidian: "南京", zhongdian: "西安", hbID: "9", hbnum: "I9662", day: "星期三", maxnum: 200, less: 200, lessgrade1: 100, lessgrade2: 100 },
    { qidian: "西安", zhongdian: "杭州", hbID: "10", hbnum: "J8526", day: "星期四", maxnum: 200, less: 200, lessgrade1: 100, lessgrade2: 100 },
    { qidian: "杭州", zhongdian: "重庆", hbID: "11", hbnum: "K6863", day: "星期二", maxnum: 200, less: 200, lessgrade1: 100, lessgrade2: 100 },
    { qidian: "重庆", zhongdian: "昆明", hbID: "12", hbnum: "L6666", day: "星期三", maxnum: 150, less: 80, lessgrade1: 80, lessgrade2: 70 },
    { qidian: "昆明", zhongdian: "贵阳", hbID: "13", hbnum: "M6546", day: "星期三", maxnum: 100, less: 100, lessgrade1: 40, lessgrade2: 60 },
    { qidian: "贵阳", zhongdian: "南宁", hbID: "14", hbnum: "N6562", day: "星期四", maxnum: 200, less: 200, lessgrade1: 100, lessgrade2: 100 },
    { qidian: "南宁", zhongdian: "兰州", hbID: "15", hbnum: "K9896", day: "星期四", maxnum: 200, less: 200, lessgrade1: 100, lessgrade2: 100 },
    { qidian: "兰州", zhongdian: "乌鲁木齐", hbID: "16", hbnum: "B8665", day: "星期一", maxnum: 200, less: 100, lessgrade1: 100, lessgrade2: 100 },
    { qidian: "上海", zhongdian: "天津", hbID: "17", hbnum: "B4534", day: "星期一", maxnum: 200, less: 50, lessgrade1: 30, lessgrade2: 120 }
  ];

  // 初始化地图
  useEffect(() => {
    const mapContainer = document.getElementById('map-container');
    if (mapContainer) {
      AMapLoader.load({
        key: 'd17c17f8f712c81a7e4241aff4faa7b0',
        plugins: ['AMap.Scale', 'AMap.ToolBar']
      }).then((AMap) => {
        const map = new AMap.Map('map-container', {
          viewMode: '2D',
          zoom: 5,
          center: [104.195397, 35.86166]
        });
        
        // 添加航线标记
        flightData.forEach(flight => {
          const startPoint = getCityCoordinates(flight.qidian);
          const endPoint = getCityCoordinates(flight.zhongdian);
          
          if (startPoint && endPoint) {
            // 添加起点标记
            new AMap.Marker({
              position: startPoint,
              map: map,
              content: `<div class="map-marker">${flight.qidian}</div>`
            });
            
            // 添加终点标记
            new AMap.Marker({
              position: endPoint,
              map: map,
              content: `<div class="map-marker">${flight.zhongdian}</div>`
            });
            
            // 添加航线
            new AMap.Polyline({
              path: [startPoint, endPoint],
              isOutline: true,
              outlineColor: '#ffeeff',
              borderWeight: 1,
              strokeColor: '#3366FF',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              lineJoin: 'round',
              lineCap: 'round',
              zIndex: 50,
              map: map
            });
          }
        });
      }).catch(e => {
        console.error('地图加载失败:', e);
      });
    }
  }, []);

  // 模拟城市坐标
  const getCityCoordinates = (city: string) => {
    const cityCoordinates = {
      '北京': [116.404, 39.915],
      '上海': [121.473, 31.230],
      '广州': [113.264, 23.129],
      '深圳': [114.057, 22.543],
      '武汉': [114.298, 30.584],
      '成都': [104.066, 30.572],
      '重庆': [106.551, 29.563],
      '杭州': [120.210, 30.246],
      '南京': [118.796, 32.060],
      '西安': [108.948, 34.263],
      '长沙': [112.982, 28.194],
      '郑州': [113.665, 34.757],
      '昆明': [102.833, 24.880],
      '贵阳': [106.630, 26.647],
      '南宁': [108.320, 22.824],
      '兰州': [103.834, 36.061],
      '乌鲁木齐': [87.617, 43.825],
      '天津': [117.201, 39.085]
    };
    return cityCoordinates[city];
  };

  // 搜索航班
  const handleSearch = () => {
    const results = flightData.filter(flight => {
      return (!searchParams.start || flight.qidian === searchParams.start) &&
             (!searchParams.end || flight.zhongdian === searchParams.end) &&
             (!searchParams.day || flight.day === searchParams.day);
    });
    setSearchResults(results);
  };

  // 预订机票
  const handleBookTicket = () => {
    const flight = flightData.find(f => f.hbID === bookingParams.flightId);
    if (flight) {
      if (bookingParams.grade === 1) {
        if (flight.lessgrade1 >= bookingParams.numTickets) {
          setBookingSuccess(true);
          setTimeout(() => setBookingSuccess(false), 3000);
        }
      } else if (flight.lessgrade2 >= bookingParams.numTickets) {
        setBookingSuccess(true);
        setTimeout(() => setBookingSuccess(false), 3000);
      }
    }
  };

  // 退票
  const handleReturnTicket = () => {
    setReturnSuccess(true);
    setTimeout(() => setReturnSuccess(false), 3000);
  };

  // 热门航线数据
  const popularRoutes = [
    { name: '上海-北京', value: 1200 },
    { name: '北京-武汉', value: 850 },
    { name: '广州-深圳', value: 1100 },
    { name: '成都-重庆', value: 700 },
    { name: '杭州-南京', value: 600 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 font-sans">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Plane className="text-blue-600 mr-2" size={24} />
            <span className="text-xl font-bold text-blue-800">航班票务系统</span>
          </div>
          
          <div className="hidden md:flex space-x-6">
            <button 
              onClick={() => setActiveTab('search')}
              className={`px-3 py-2 rounded-md ${activeTab === 'search' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-blue-600'}`}
            >
              <Search className="inline mr-1" size={18} /> 查询航班
            </button>
            <button 
              onClick={() => setActiveTab('book')}
              className={`px-3 py-2 rounded-md ${activeTab === 'book' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-blue-600'}`}
            >
              <Ticket className="inline mr-1" size={18} /> 预订机票
            </button>
            <button 
              onClick={() => setActiveTab('return')}
              className={`px-3 py-2 rounded-md ${activeTab === 'return' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-blue-600'}`}
            >
              <ArrowDownLeft className="inline mr-1" size={18} /> 退票服务
            </button>
          </div>
          
          <button 
            className="md:hidden text-gray-600 p-2 rounded-md hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        {/* 移动端菜单 */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-200 overflow-hidden"
            >
              <div className="px-4 py-2 space-y-2">
                <button 
                  onClick={() => { setActiveTab('search'); setIsMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-md ${activeTab === 'search' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-blue-600'}`}
                >
                  <Search className="inline mr-2" size={18} /> 查询航班
                </button>
                <button 
                  onClick={() => { setActiveTab('book'); setIsMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-md ${activeTab === 'book' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-blue-600'}`}
                >
                  <Ticket className="inline mr-2" size={18} /> 预订机票
                </button>
                <button 
                  onClick={() => { setActiveTab('return'); setIsMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-md ${activeTab === 'return' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-blue-600'}`}
                >
                  <ArrowDownLeft className="inline mr-2" size={18} /> 退票服务
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-8">
        {/* 成功提示 */}
        <AnimatePresence>
          {bookingSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6"
            >
              预订成功！已为您预订{bookingParams.numTickets}张{bookingParams.grade === 1 ? '一等舱' : '二等舱'}机票
            </motion.div>
          )}
          {returnSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6"
            >
              退票成功！已为您办理退票手续
            </motion.div>
          )}
        </AnimatePresence>

        {/* 查询航班 */}
        {activeTab === 'search' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Search className="text-blue-600 mr-2" size={24} />
                航班查询
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">出发城市</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={searchParams.start}
                    onChange={(e) => setSearchParams({...searchParams, start: e.target.value})}
                  >
                    <option value="">全部城市</option>
                    {Array.from(new Set(flightData.map(f => f.qidian))).map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">到达城市</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={searchParams.end}
                    onChange={(e) => setSearchParams({...searchParams, end: e.target.value})}
                  >
                    <option value="">全部城市</option>
                    {Array.from(new Set(flightData.map(f => f.zhongdian))).map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">出发日期</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={searchParams.day}
                    onChange={(e) => setSearchParams({...searchParams, day: e.target.value})}
                  >
                    <option value="">全部日期</option>
                    {Array.from(new Set(flightData.map(f => f.day))).map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button
                onClick={handleSearch}
                className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                查询航班
              </button>
            </div>
            
            {/* 查询结果 */}
            {searchResults.length > 0 && (
              <div className="border-t border-gray-200">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">查询结果 ({searchResults.length}条)</h3>
                  
                  <div className="space-y-4">
                    {searchResults.map((flight, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="mb-4 md:mb-0">
                            <div className="flex items-center">
                              <Plane className="text-blue-600 mr-2" size={20} />
                              <span className="font-bold text-lg">{flight.qidian} → {flight.zhongdian}</span>
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                              <span className="inline-block mr-4"><Calendar className="inline mr-1" size={14} /> {flight.day}</span>
                              <span className="inline-block mr-4"><Clock className="inline mr-1" size={14} /> 航班号: {flight.hbnum}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                            <div className="mb-2 sm:mb-0">
                              <div className="text-sm text-gray-500">一等舱剩余</div>
                              <div className="text-xl font-bold text-blue-600">{flight.lessgrade1}</div>
                            </div>
                            <div className="mb-2 sm:mb-0">
                              <div className="text-sm text-gray-500">二等舱剩余</div>
                              <div className="text-xl font-bold text-blue-600">{flight.lessgrade2}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">总剩余</div>
                              <div className="text-xl font-bold text-blue-600">{flight.less}</div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
        
        {/* 预订机票 */}
        {activeTab === 'book' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Ticket className="text-blue-600 mr-2" size={24} />
                机票预订
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">航班号</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={bookingParams.flightId}
                      onChange={(e) => setBookingParams({...bookingParams, flightId: e.target.value})}
                    >
                      <option value="">选择航班</option>
                      {flightData.map(flight => (
                        <option key={flight.hbID} value={flight.hbID}>
                          {flight.hbnum} ({flight.qidian}→{flight.zhongdian})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">乘客姓名</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={bookingParams.name}
                      onChange={(e) => setBookingParams({...bookingParams, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">身份证号</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={bookingParams.idNum}
                      onChange={(e) => setBookingParams({...bookingParams, idNum: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">出发日期</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={bookingParams.day}
                      onChange={(e) => setBookingParams({...bookingParams, day: e.target.value})}
                    >
                      <option value="">选择日期</option>
                      {Array.from(new Set(flightData.map(f => f.day))).map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">票数</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={bookingParams.numTickets}
                      onChange={(e) => setBookingParams({...bookingParams, numTickets: parseInt(e.target.value) || 1})}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">舱位等级</label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          checked={bookingParams.grade === 1}
                          onChange={() => setBookingParams({...bookingParams, grade: 1})}
                        />
                        <span className="ml-2 text-gray-700">一等舱</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          checked={bookingParams.grade === 2}
                          onChange={() => setBookingParams({...bookingParams, grade: 2})}
                        />
                        <span className="ml-2 text-gray-700">二等舱</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleBookTicket}
                className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors mt-4"
              >
                确认预订
              </button>
            </div>
          </motion.div>
        )}
        
        {/* 退票服务 */}
        {activeTab === 'return' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <ArrowDownLeft className="text-blue-600 mr-2" size={24} />
                退票服务
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">航班号</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={returnParams.flightId}
                      onChange={(e) => setReturnParams({...returnParams, flightId: e.target.value})}
                    >
                      <option value="">选择航班</option>
                      {flightData.map(flight => (
                        <option key={flight.hbID} value={flight.hbID}>
                          {flight.hbnum} ({flight.qidian}→{flight.zhongdian})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">身份证号</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={returnParams.idNum}
                      onChange={(e) => setReturnParams({...returnParams, idNum: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={handleReturnTicket}
                    className="w-full md:w-auto px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                  >
                    确认退票
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* 数据可视化 */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 热门航线 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <MapPin className="text-blue-600 mr-2" size={20} />
              热门航线
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={popularRoutes}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#3b82f6" name="预订量" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          
          {/* 航班地图 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <MapPin className="text-blue-600 mr-2" size={20} />
              航线网络图
            </h3>
            <div id="map-container" className="h-64 rounded-lg overflow-hidden"></div>
          </motion.div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <div className="mb-2">
            created by <a href="https://space.coze.cn" className="text-blue-600 hover:underline">coze space</a>
          </div>
          <div>页面内容均由 AI 生成，仅供参考</div>
        </div>
      </footer>
    </div>
  );
};

export default FlightBookingSystem;
