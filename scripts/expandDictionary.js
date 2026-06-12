/**
 * 扩充内置词典 — 追加更多常用词语
 * 覆盖食物、科技、交通、日常等话题
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'frontend', 'src', 'data');
const DICT_PATH = path.join(DATA_DIR, 'dictionary.json');
const INDEX_PATH = path.join(DATA_DIR, 'charIndex.json');

// 读取现有词典
const existingDict = JSON.parse(fs.readFileSync(DICT_PATH, 'utf-8'));

// 大量新增词汇（按话题分类）
const newWords = [
  // ===== 饮食 =====
  { word: '咖啡', pinyin: 'ka fei', definition: '用咖啡豆制成的饮料' },
  { word: '茶叶', pinyin: 'cha ye', definition: '用茶树的嫩叶制成的饮品原料' },
  { word: '奶茶', pinyin: 'nai cha', definition: '牛奶和茶混合的饮品' },
  { word: '面包', pinyin: 'mian bao', definition: '用面粉发酵烤制的食品' },
  { word: '蛋糕', pinyin: 'dan gao', definition: '用鸡蛋面粉等烤制的甜点' },
  { word: '牛奶', pinyin: 'niu nai', definition: '奶牛产的奶' },
  { word: '果汁', pinyin: 'guo zhi', definition: '从水果中榨取的汁液' },
  { word: '啤酒', pinyin: 'pi jiu', definition: '用麦芽发酵制成的酒精饮料' },
  { word: '白酒', pinyin: 'bai jiu', definition: '中国传统的烈性蒸馏酒' },
  { word: '红酒', pinyin: 'hong jiu', definition: '用葡萄酿造的红色果酒' },
  { word: '餐厅', pinyin: 'can ting', definition: '供顾客用餐的场所' },
  { word: '厨房', pinyin: 'chu fang', definition: '做饭做菜的房间' },
  { word: '美食', pinyin: 'mei shi', definition: '美味的食物' },
  { word: '早餐', pinyin: 'zao can', definition: '早晨吃的饭' },
  { word: '晚餐', pinyin: 'wan can', definition: '晚上吃的饭' },
  { word: '午餐', pinyin: 'wu can', definition: '中午吃的饭' },
  { word: '水果', pinyin: 'shui guo', definition: '可食用的植物果实' },
  { word: '蔬菜', pinyin: 'shu cai', definition: '可做菜食用的草本植物' },
  { word: '火锅', pinyin: 'huo guo', definition: '一种边煮边吃的烹饪方式' },
  { word: '米饭', pinyin: 'mi fan', definition: '用大米煮熟的饭' },
  { word: '面条', pinyin: 'mian tiao', definition: '用面粉做成的条状食品' },
  { word: '糖果', pinyin: 'tang guo', definition: '用糖制成的甜食' },
  { word: '豆奶', pinyin: 'dou nai', definition: '用大豆制成的植物奶' },
  { word: '咖啡豆', pinyin: 'ka fei dou', definition: '咖啡树的果实' },
  { word: '喝茶', pinyin: 'he cha', definition: '饮用茶水' },
  { word: '甜品', pinyin: 'tian pin', definition: '甜味的食品' },
  { word: '饼干', pinyin: 'bing gan', definition: '用面粉烤制的薄脆食品' },
  { word: '巧克力', pinyin: 'qiao ke li', definition: '用可可制成的甜食' },
  { word: '冰淇淋', pinyin: 'bing qi lin', definition: '冰冻的甜味乳制品' },
  { word: '烹饪', pinyin: 'peng ren', definition: '做饭做菜' },
  { word: '茶道', pinyin: 'cha dao', definition: '品茶的艺术和礼仪' },
  { word: '食堂', pinyin: 'shi tang', definition: '单位或学校的餐厅' },
  { word: '菜系', pinyin: 'cai xi', definition: '具有地域特色的烹饪体系' },
  { word: '饮料', pinyin: 'yin liao', definition: '供饮用的液体' },

  // ===== 科技 =====
  { word: '电脑', pinyin: 'dian nao', definition: '电子计算机' },
  { word: '手机', pinyin: 'shou ji', definition: '移动电话' },
  { word: '网络', pinyin: 'wang luo', definition: '互联网；连接的系统' },
  { word: '软件', pinyin: 'ruan jian', definition: '计算机程序和数据' },
  { word: '硬件', pinyin: 'ying jian', definition: '计算机的物理设备' },
  { word: '数据', pinyin: 'shu ju', definition: '用于计算和记录的数值信息' },
  { word: '程序', pinyin: 'cheng xu', definition: '计算机执行的指令序列' },
  { word: '算法', pinyin: 'suan fa', definition: '解决问题的步骤方法' },
  { word: '人工智能', pinyin: 'ren gong zhi neng', definition: '模拟人类智能的技术' },
  { word: '机器人', pinyin: 'ji qi ren', definition: '能自动执行任务的机器' },
  { word: '互联网', pinyin: 'hu lian wang', definition: '全球信息网络系统' },
  { word: '游戏', pinyin: 'you xi', definition: '娱乐活动；电子游戏' },
  { word: '屏幕', pinyin: 'ping mu', definition: '显示图像的平面' },
  { word: '键盘', pinyin: 'jian pan', definition: '输入文字的按键装置' },
  { word: '芯片', pinyin: 'xin pian', definition: '集成电路的微型元件' },
  { word: '数码', pinyin: 'shu ma', definition: '数字化的技术' },
  { word: '编程', pinyin: 'bian cheng', definition: '编写计算机程序' },
  { word: '编码', pinyin: 'bian ma', definition: '将信息转换为代码' },
  { word: '网站', pinyin: 'wang zhan', definition: '互联网上的信息站点' },
  { word: '直播', pinyin: 'zhi bo', definition: '实时播放的节目或视频' },
  { word: '视频', pinyin: 'shi pin', definition: '连续的影像画面' },
  { word: '音频', pinyin: 'yin pin', definition: '记录的声音信号' },

  // ===== 交通 =====
  { word: '汽车', pinyin: 'qi che', definition: '用内燃机驱动的机动车' },
  { word: '火车', pinyin: 'huo che', definition: '在铁轨上行驶的列车' },
  { word: '飞机', pinyin: 'fei ji', definition: '在空中飞行的交通工具' },
  { word: '地铁', pinyin: 'di tie', definition: '在地下运行的铁路交通' },
  { word: '公交', pinyin: 'gong jiao', definition: '公共交通汽车' },
  { word: '单车', pinyin: 'dan che', definition: '自行车' },
  { word: '轮船', pinyin: 'lun chuan', definition: '大型的船只' },
  { word: '高铁', pinyin: 'gao tie', definition: '高速铁路列车' },
  { word: '马路', pinyin: 'ma lu', definition: '供车辆行驶的道路' },
  { word: '车站', pinyin: 'che zhan', definition: '车辆停靠上下客的地方' },
  { word: '机场', pinyin: 'ji chang', definition: '飞机起飞降落的场所' },
  { word: '港口', pinyin: 'gang kou', definition: '船只停泊装卸的地方' },
  { word: '桥梁', pinyin: 'qiao liang', definition: '横跨水域或低谷的建筑物' },
  { word: '隧道', pinyin: 'sui dao', definition: '穿山越岭的地下通道' },
  { word: '驾驶', pinyin: 'jia shi', definition: '操纵车辆行驶' },
  { word: '航班', pinyin: 'hang ban', definition: '飞机的航次' },
  { word: '旅行箱', pinyin: 'lv xing xiang', definition: '旅行时用的箱子' },

  // ===== 身体/健康 =====
  { word: '身体', pinyin: 'shen ti', definition: '人的躯体' },
  { word: '健康', pinyin: 'jian kang', definition: '身体和心理的良好状态' },
  { word: '运动', pinyin: 'yun dong', definition: '锻炼身体的活动' },
  { word: '心脏', pinyin: 'xin zang', definition: '推动血液循环的器官' },
  { word: '眼睛', pinyin: 'yan jing', definition: '视觉器官' },
  { word: '耳朵', pinyin: 'er duo', definition: '听觉器官' },
  { word: '大脑', pinyin: 'da nao', definition: '中枢神经系统的主要部分' },
  { word: '头发', pinyin: 'tou fa', definition: '长在头上的毛发' },
  { word: '手指', pinyin: 'shou zhi', definition: '手的分支部分' },
  { word: '脚部', pinyin: 'jiao bu', definition: '人体的足部' },
  { word: '睡眠', pinyin: 'shui mian', definition: '大脑休息的状态' },
  { word: '微笑', pinyin: 'wei xiao', definition: '轻微的笑容' },
  { word: '眼泪', pinyin: 'yan lei', definition: '从眼睛流出的液体' },
  { word: '呼吸', pinyin: 'hu xi', definition: '吸入氧气呼出二氧化碳' },
  { word: '瑜伽', pinyin: 'yu jia', definition: '身心修炼的印度传统方法' },
  { word: '跑步', pinyin: 'pao bu', definition: '以较快速度行进' },
  { word: '游泳', pinyin: 'you yong', definition: '在水中游动' },
  { word: '健身', pinyin: 'jian shen', definition: '锻炼身体保持健康' },
  { word: '诊所', pinyin: 'zhen suo', definition: '小型医疗场所' },
  { word: '药物', pinyin: 'yao wu', definition: '用于治疗疾病的物质' },
  { word: '病房', pinyin: 'bing fang', definition: '医院的房间' },

  // ===== 情绪/性格 =====
  { word: '焦虑', pinyin: 'jiao lv', definition: '紧张不安的情绪' },
  { word: '兴奋', pinyin: 'xing fen', definition: '激动高兴的状态' },
  { word: '平静', pinyin: 'ping jing', definition: '内心安定不激动' },
  { word: '感动', pinyin: 'gan dong', definition: '因触动内心而产生的情感' },
  { word: '寂寞', pinyin: 'ji mo', definition: '孤单冷清的感觉' },
  { word: '自卑', pinyin: 'zi bei', definition: '看不起自己的心理' },
  { word: '自信', pinyin: 'zi xin', definition: '相信自己的能力' },
  { word: '骄傲', pinyin: 'jiao ao', definition: '自以为了不起' },
  { word: '谦虚', pinyin: 'qian xu', definition: '不骄傲自满' },
  { word: '善良', pinyin: 'shan liang', definition: '心地好' },
  { word: '坚强', pinyin: 'jian qiang', definition: '坚定有毅力' },
  { word: '脆弱', pinyin: 'cui ruo', definition: '容易受到伤害' },
  { word: '敏感', pinyin: 'min gan', definition: '感知敏锐' },
  { word: '好奇', pinyin: 'hao qi', definition: '对新事物感兴趣' },
  { word: '满足', pinyin: 'man zu', definition: '感到足够满意' },
  { word: '感恩', pinyin: 'gan en', definition: '感激别人的恩情' },

  // ===== 职业 =====
  { word: '教师', pinyin: 'jiao shi', definition: '从事教育职业的人' },
  { word: '学生', pinyin: 'xue sheng', definition: '在校学习的人' },
  { word: '律师', pinyin: 'lv shi', definition: '从事法律服务的人' },
  { word: '警察', pinyin: 'jing cha', definition: '维护社会治安的人员' },
  { word: '军人', pinyin: 'jun ren', definition: '服役于军队的人' },
  { word: '商贩', pinyin: 'shang fan', definition: '做买卖的人' },
  { word: '设计师', pinyin: 'she ji shi', definition: '从事设计工作的人' },
  { word: '工程师', pinyin: 'gong cheng shi', definition: '从事工程技术的人' },
  { word: '记者', pinyin: 'ji zhe', definition: '从事新闻采访的人' },
  { word: '演员', pinyin: 'yan yuan', definition: '从事表演艺术的人' },
  { word: '导演', pinyin: 'dao yan', definition: '指导戏剧或电影的人' },
  { word: '运动员', pinyin: 'yun dong yuan', definition: '从事体育运动的人' },
  { word: '老板', pinyin: 'lao ban', definition: '企业的所有者' },
  { word: '员工', pinyin: 'yuan gong', definition: '受雇佣的工作人员' },
  { word: '护士', pinyin: 'hu shi', definition: '护理病人的医务人员' },
  { word: '农民', pinyin: 'nong min', definition: '从事农业生产的人' },
  { word: '渔夫', pinyin: 'yu fu', definition: '以打鱼为生的人' },

  // ===== 社会 =====
  { word: '政治', pinyin: 'zheng zhi', definition: '治理国家的活动' },
  { word: '经济', pinyin: 'jing ji', definition: '社会物质生产和分配活动' },
  { word: '法律', pinyin: 'fa lv', definition: '由国家制定的行为规范' },
  { word: '教育', pinyin: 'jiao yu', definition: '培养人才的活动' },
  { word: '宗教', pinyin: 'zong jiao', definition: '对神灵的信仰体系' },
  { word: '民族', pinyin: 'min zu', definition: '具有共同文化的人群' },
  { word: '国家', pinyin: 'guo jia', definition: '独立的政治实体' },
  { word: '政府', pinyin: 'zheng fu', definition: '国家的行政机关' },
  { word: '社区', pinyin: 'she qu', definition: '一定区域内的社会群体' },
  { word: '家庭', pinyin: 'jia ting', definition: '以婚姻和血缘为基础的社会单位' },
  { word: '婚姻', pinyin: 'hun yin', definition: '男女结为夫妻的关系' },
  { word: '传统', pinyin: 'chuan tong', definition: '世代相传的习俗观念' },
  { word: '节日', pinyin: 'jie ri', definition: '有特殊意义的纪念日' },
  { word: '仪式', pinyin: 'yi shi', definition: '按传统规程举行的活动' },
  { word: '新闻', pinyin: 'xin wen', definition: '新近发生的事件报道' },
  { word: '广告', pinyin: 'guang gao', definition: '宣传推广的信息' },

  // ===== 自然补充 =====
  { word: '湖泊', pinyin: 'hu po', definition: '陆地中的大片积水' },
  { word: '瀑布', pinyin: 'pu bu', definition: '从高处落下的水流' },
  { word: '温泉', pinyin: 'wen quan', definition: '天然的热水源' },
  { word: '冰川', pinyin: 'bing chuan', definition: '终年不化的巨大冰体' },
  { word: '火山', pinyin: 'huo shan', definition: '能喷发熔岩的山' },
  { word: '地震', pinyin: 'di zhen', definition: '地壳的震动' },
  { word: '闪电', pinyin: 'shan dian', definition: '云层间的放电现象' },
  { word: '雷声', pinyin: 'lei sheng', definition: '闪电伴随的巨响' },
  { word: '台风', pinyin: 'tai feng', definition: '强烈的热带气旋' },
  { word: '季节', pinyin: 'ji jie', definition: '一年中有明显气候差异的时段' },
  { word: '夏天', pinyin: 'xia tian', definition: '一年中最热的季节' },
  { word: '冬天', pinyin: 'dong tian', definition: '一年中最冷的季节' },
  { word: '气候', pinyin: 'qi hou', definition: '长期的大气状况' },
  { word: '露水', pinyin: 'lu shui', definition: '夜间凝结在物体上的水滴' },
  { word: '霜冻', pinyin: 'shuang dong', definition: '温度降到冰点以下的现象' },
  { word: '雾气', pinyin: 'wu qi', definition: '近地层的微小水滴' },
  { word: '月亮圆', pinyin: 'yue liang yuan', definition: '满月的状态' },

  // ===== 空间/方向 =====
  { word: '方向', pinyin: 'fang xiang', definition: '朝向的位置' },
  { word: '东方', pinyin: 'dong fang', definition: '太阳升起的方向' },
  { word: '西方', pinyin: 'xi fang', definition: '太阳落下的方向' },
  { word: '南方', pinyin: 'nan fang', definition: '与北相对的方向' },
  { word: '北方', pinyin: 'bei fang', definition: '与南相对的方向' },
  { word: '中央', pinyin: 'zhong yang', definition: '中心位置' },
  { word: '边缘', pinyin: 'bian yuan', definition: '外围或边界区域' },
  { word: '角度', pinyin: 'jiao du', definition: '几何中的角度' },

  // ===== 颜色 =====
  { word: '红色', pinyin: 'hong se', definition: '像血或火的颜色' },
  { word: '蓝色', pinyin: 'lan se', definition: '像天空或海洋的颜色' },
  { word: '绿色', pinyin: 'lv se', definition: '像草和树叶的颜色' },
  { word: '黄色', pinyin: 'huang se', definition: '像金子或向日葵的颜色' },
  { word: '白色', pinyin: 'bai se', definition: '像雪或牛奶的颜色' },
  { word: '黑色', pinyin: 'hei se', definition: '像煤炭或墨水的颜色' },
  { word: '紫色', pinyin: 'zi se', definition: '红和蓝混合的颜色' },
  { word: '灰色', pinyin: 'hui se', definition: '黑和白中间的颜色' },
  { word: '粉色', pinyin: 'fen se', definition: '淡红的颜色' },
  { word: '彩色', pinyin: 'cai se', definition: '各种颜色' },

  // ===== 动物 =====
  { word: '动物', pinyin: 'dong wu', definition: '有生命的能动的生物' },
  { word: '猫咪', pinyin: 'mao mi', definition: '猫的亲昵称呼' },
  { word: '小狗', pinyin: 'xiao gou', definition: '年幼的狗' },
  { word: '鸟类', pinyin: 'niao lei', definition: '有羽毛的卵生动物' },
  { word: '鱼类', pinyin: 'yu lei', definition: '水生脊椎动物' },
  { word: '蝴蝶', pinyin: 'hu die', definition: '有彩色翅膀的昆虫' },
  { word: '蜜蜂', pinyin: 'mi feng', definition: '采花酿蜜的昆虫' },
  { word: '大象', pinyin: 'da xiang', definition: '最大的陆地动物' },
  { word: '老虎', pinyin: 'lao hu', definition: '大型猫科猛兽' },
  { word: '狮子', pinyin: 'shi zi', definition: '大型猫科动物' },
  { word: '熊猫', pinyin: 'xiong mao', definition: '中国的国宝动物' },
  { word: '兔子', pinyin: 'tu zi', definition: '长耳朵的草食动物' },
  { word: '宠物', pinyin: 'chong wu', definition: '供人玩赏的动物' },
  { word: '野生', pinyin: 'ye sheng', definition: '未经人工驯化的' },
  { word: '森林', pinyin: 'sen lin', definition: '大片树林' },
  { word: '巢穴', pinyin: 'chao xue', definition: '动物的住处' },

  // ===== 房屋/建筑 =====
  { word: '建筑', pinyin: 'jian zhu', definition: '建造的房屋或结构物' },
  { word: '房间', pinyin: 'fang jian', definition: '房屋内的隔间' },
  { word: '窗户', pinyin: 'chuang hu', definition: '墙上通风透光的装置' },
  { word: '大门', pinyin: 'da men', definition: '出入口' },
  { word: '客厅', pinyin: 'ke ting', definition: '接待客人的房间' },
  { word: '卧室', pinyin: 'wo shi', definition: '睡觉的房间' },
  { word: '阳台', pinyin: 'yang tai', definition: '房屋外的平台' },
  { word: '楼梯', pinyin: 'lou ti', definition: '上下楼的台阶通道' },
  { word: '屋顶', pinyin: 'wu ding', definition: '房屋的顶部' },
  { word: '花园', pinyin: 'hua yuan', definition: '种植花草的园地' },
  { word: '墙壁', pinyin: 'qiang bi', definition: '房屋的立面墙体' },
  { word: '地板', pinyin: 'di ban', definition: '房间的地面' },
  { word: '家具', pinyin: 'jia ju', definition: '家庭使用的器具' },
  { word: '沙发', pinyin: 'sha fa', definition: '软体坐具' },
  { word: '桌子', pinyin: 'zhuo zi', definition: '有平面的家具' },
  { word: '椅子', pinyin: 'yi zi', definition: '有靠背的坐具' },
  { word: '床铺', pinyin: 'chuang pu', definition: '供人睡觉的家具' },

  // ===== 穿着 =====
  { word: '衣服', pinyin: 'yi fu', definition: '穿在身上的纺织品' },
  { word: '裤子', pinyin: 'ku zi', definition: '穿在下半身的衣物' },
  { word: '裙子', pinyin: 'qun zi', definition: '女性的下身外衣' },
  { word: '鞋子', pinyin: 'xie zi', definition: '穿在脚上的物品' },
  { word: '帽子', pinyin: 'mao zi', definition: '戴在头上的物品' },
  { word: '围巾', pinyin: 'wei jin', definition: '围在脖子上的织物' },
  { word: '手套', pinyin: 'shou tao', definition: '戴在手上的套子' },
  { word: '时尚', pinyin: 'shi shang', definition: '流行的风尚' },
  { word: '风格', pinyin: 'feng ge', definition: '独特的样式和格调' },
  { word: '潮流', pinyin: 'chao liu', definition: '流行的趋势' },
  { word: '品牌', pinyin: 'pin pai', definition: '商品的牌子' },
  { word: '设计', pinyin: 'she ji', definition: '预先规划造型和功能' },
  { word: '材料', pinyin: 'cai liao', definition: '制作物品的原料' },
  { word: '布料', pinyin: 'bu liao', definition: '做衣服的纺织品' },

  // ===== 运动/游戏 =====
  { word: '足球', pinyin: 'zu qiu', definition: '用脚踢球的运动' },
  { word: '篮球', pinyin: 'lan qiu', definition: '将球投入篮筐的运动' },
  { word: '网球', pinyin: 'wang qiu', definition: '用球拍击球的运动' },
  { word: '比赛', pinyin: 'bi sai', definition: '比较胜负的竞赛' },
  { word: '冠军', pinyin: 'guan jun', definition: '比赛的第一名' },
  { word: '挑战', pinyin: 'tiao zhan', definition: '鼓动对方与自己较量' },
  { word: '胜利', pinyin: 'sheng li', definition: '打败对手' },
  { word: '失败', pinyin: 'shi bai', definition: '被对手打败' },
  { word: '团队', pinyin: 'tuan dui', definition: '为共同目标协作的群体' },
  { word: '合作', pinyin: 'he zuo', definition: '互相配合一起做' },
  { word: '竞争', pinyin: 'jing zheng', definition: '为自身利益与人争胜' },
  { word: '棋牌', pinyin: 'qi pai', definition: '棋类和牌类游戏' },
  { word: '围棋', pinyin: 'wei qi', definition: '中国传统的策略棋盘游戏' },
  { word: '象棋', pinyin: 'xiang qi', definition: '模拟战争的棋盘游戏' },

  // ===== 教育 =====
  { word: '大学', pinyin: 'da xue', definition: '高等教育机构' },
  { word: '中学', pinyin: 'zhong xue', definition: '中等教育学校' },
  { word: '小学', pinyin: 'xiao xue', definition: '初等教育学校' },
  { word: '课程', pinyin: 'ke cheng', definition: '教学的科目和内容' },
  { word: '考试', pinyin: 'kao shi', definition: '考查知识水平的方式' },
  { word: '论文', pinyin: 'lun wen', definition: '学术研究文章' },
  { word: '毕业', pinyin: 'bi ye', definition: '完成学业' },
  { word: '知识', pinyin: 'zhi shi', definition: '人类认识的成果' },
  { word: '研究', pinyin: 'yan jiu', definition: '深入探求事物的规律' },
  { word: '学术', pinyin: 'xue shu', definition: '系统的专门学问' },
  { word: '文凭', pinyin: 'wen ping', definition: '学历证书' },
  { word: '留学', pinyin: 'liu xue', definition: '到外国学习' },

  // ===== 艺术补充 =====
  { word: '文学', pinyin: 'wen xue', definition: '用语言文字表达的艺术' },
  { word: '小说', pinyin: 'xiao shuo', definition: '虚构的叙事文学作品' },
  { word: '散文', pinyin: 'san wen', definition: '不拘韵律的文学作品' },
  { word: '戏剧', pinyin: 'xi ju', definition: '舞台表演艺术' },
  { word: '喜剧', pinyin: 'xi ju', definition: '引人发笑的戏剧' },
  { word: '悲剧', pinyin: 'bei ju', definition: '以悲惨结局收场的戏剧' },
  { word: '摄影', pinyin: 'she ying', definition: '用相机拍摄图像' },
  { word: '雕塑', pinyin: 'diao su', definition: '雕刻塑造的立体艺术' },
  { word: '书法', pinyin: 'shu fa', definition: '文字书写的艺术' },
  { word: '漫画', pinyin: 'man hua', definition: '用简练线条表现的图画' },
  { word: '动画', pinyin: 'dong hua', definition: '动态的漫画或图像' },
  { word: '插图', pinyin: 'cha tu', definition: '穿插在文字中的图画' },

  // ===== 商业 =====
  { word: '公司', pinyin: 'gong si', definition: '企业组织形式' },
  { word: '商业', pinyin: 'shang ye', definition: '从事买卖的活动' },
  { word: '投资', pinyin: 'tou zi', definition: '将资金投入以取得收益' },
  { word: '股票', pinyin: 'gu piao', definition: '股份公司发行的所有权凭证' },
  { word: '银行', pinyin: 'yin hang', definition: '经营货币的金融机构' },
  { word: '金钱', pinyin: 'jin qian', definition: '货币；财富' },
  { word: '财富', pinyin: 'cai fu', definition: '大量金钱和物资' },
  { word: '创业', pinyin: 'chuang ye', definition: '创办事业' },
  { word: '营销', pinyin: 'ying xiao', definition: '推广和销售的活动' },
  { word: '顾客', pinyin: 'gu ke', definition: '购买商品的人' },
  { word: '服务', pinyin: 'fu wu', definition: '为他人提供便利的活动' },
  { word: '产品', pinyin: 'chan pin', definition: '生产出来的物品' },

  // ===== 补充更多常用词 =====
  { word: '汉字', pinyin: 'han zi', definition: '中文的书写文字' },
  { word: '语言', pinyin: 'yu yan', definition: '人类交流的工具' },
  { word: '对话', pinyin: 'dui hua', definition: '两人或多人交谈' },
  { word: '交流', pinyin: 'jiao liu', definition: '互相沟通' },
  { word: '理解', pinyin: 'li jie', definition: '明白懂得' },
  { word: '认识', pinyin: 'ren shi', definition: '认得了解' },
  { word: '关系', pinyin: 'guan xi', definition: '人或事物间的联系' },
  { word: '联系', pinyin: 'lian xi', definition: '彼此接上关系' },
  { word: '方法', pinyin: 'fang fa', definition: '解决问题的门路' },
  { word: '结果', pinyin: 'jie guo', definition: '事物发展的最终状况' },
  { word: '过程', pinyin: 'guo cheng', definition: '事物发展的经过' },
  { word: '原因', pinyin: 'yuan yin', definition: '引起结果的条件' },
  { word: '变化', pinyin: 'bian hua', definition: '事物在形态上的转化' },
  { word: '发展', pinyin: 'fa zhan', definition: '事物由小到大由低到高' },
  { word: '进步', pinyin: 'jin bu', definition: '向前发展提高' },
  { word: '成功', pinyin: 'cheng gong', definition: '达到预期目的' },
  { word: '困难', pinyin: 'kun nan', definition: '不容易解决的事情' },
  { word: '问题', pinyin: 'wen ti', definition: '需要解决的矛盾' },
  { word: '答案', pinyin: 'da an', definition: '问题的解答' },
  { word: '选择', pinyin: 'xuan ze', definition: '在多个中挑出合适的' },
  { word: '决定', pinyin: 'jue ding', definition: '做出主张' },
  { word: '开始', pinyin: 'kai shi', definition: '从头起' },
  { word: '结束', pinyin: 'jie shu', definition: '完毕停止' },
  { word: '帮助', pinyin: 'bang zhu', definition: '替人出力支援' },
  { word: '保护', pinyin: 'bao hu', definition: '尽力照顾使不受损害' },
  { word: '环境', pinyin: 'huan jing', definition: '周围的地方和条件' },
  { word: '能源', pinyin: 'neng yuan', definition: '能产生能量的资源' },
  { word: '资源', pinyin: 'zi yuan', definition: '可利用的天然物质' },
  { word: '安全', pinyin: 'an quan', definition: '平安没有危险' },
  { word: '危险', pinyin: 'wei xian', definition: '不安全有损害的可能' },
];

// 合并、去重
const seen = new Set(existingDict.map(w => w.word));
const added = [];

for (const w of newWords) {
  if (!seen.has(w.word)) {
    seen.add(w.word);
    existingDict.push(w);
    added.push(w.word);
  }
}

console.log(`原有: ${existingDict.length - added.length} 词`);
console.log(`新增: ${added.length} 词`);
console.log(`总计: ${existingDict.length} 词`);

// 重建倒排索引
const charIndex = {};
for (let i = 0; i < existingDict.length; i++) {
  const word = existingDict[i].word;
  const chars = new Set();
  for (const ch of word) {
    if (!chars.has(ch)) {
      chars.add(ch);
      if (!charIndex[ch]) charIndex[ch] = [];
      charIndex[ch].push(i);
    }
  }
}

console.log(`汉字覆盖: ${Object.keys(charIndex).length} 个`);

// 写入
fs.writeFileSync(DICT_PATH, JSON.stringify(existingDict), 'utf-8');
fs.writeFileSync(INDEX_PATH, JSON.stringify(charIndex), 'utf-8');

// 验证咖啡
console.log('\n验证:');
console.log('咖在索引中:', '咖' in charIndex);
console.log('啡在索引中:', '啡' in charIndex);
if (charIndex['咖']) {
  console.log('含"咖"的词:', charIndex['咖'].map(i => existingDict[i].word));
}
if (charIndex['啡']) {
  console.log('含"啡"的词:', charIndex['啡'].map(i => existingDict[i].word));
}

console.log('\n✅ 词典扩充完成！');
