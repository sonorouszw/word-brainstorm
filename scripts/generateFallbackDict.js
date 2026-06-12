/**
 * 直接生成内置备用词典
 * 联网下载 CC-CEDICT 失败时的本地方案
 */
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'frontend', 'src', 'data');
const DICT_OUTPUT = path.join(OUTPUT_DIR, 'dictionary.json');
const INDEX_OUTPUT = path.join(OUTPUT_DIR, 'charIndex.json');

function extractChars(word) {
  const chars = [];
  for (const ch of word) {
    if (!chars.includes(ch)) chars.push(ch);
  }
  return chars;
}

// 精选 ~300 个常用中文词语
const rawWords = [
  // 自然
  { word: '月亮', pinyin: 'yue liang', definition: '地球的天然卫星；月光' },
  { word: '太阳', pinyin: 'tai yang', definition: '太阳系的中心恒星；阳光' },
  { word: '星星', pinyin: 'xing xing', definition: '夜空中闪烁的天体' },
  { word: '天空', pinyin: 'tian kong', definition: '地面以上的空间；苍穹' },
  { word: '地球', pinyin: 'di qiu', definition: '人类居住的星球' },
  { word: '海洋', pinyin: 'hai yang', definition: '覆盖地球大部分的咸水体' },
  { word: '森林', pinyin: 'sen lin', definition: '大片生长的树木' },
  { word: '河流', pinyin: 'he liu', definition: '沿河道流动的水流' },
  { word: '山峰', pinyin: 'shan feng', definition: '山的最高点' },
  { word: '花朵', pinyin: 'hua duo', definition: '植物的繁殖器官；鲜花' },
  { word: '春天', pinyin: 'chun tian', definition: '四季之首；温暖季节' },
  { word: '秋天', pinyin: 'qiu tian', definition: '收获的季节' },
  { word: '风雨', pinyin: 'feng yu', definition: '风和雨；比喻艰难' },
  { word: '雪花', pinyin: 'xue hua', definition: '雪的花瓣状晶体' },
  { word: '彩虹', pinyin: 'cai hong', definition: '雨后天空的彩色弧线' },
  { word: '黎明', pinyin: 'li ming', definition: '天刚亮的时候' },
  { word: '黄昏', pinyin: 'huang hun', definition: '日落后的时刻' },
  { word: '风景', pinyin: 'feng jing', definition: '自然或人文的景观' },
  { word: '草原', pinyin: 'cao yuan', definition: '大片生长草本植物的区域' },
  { word: '沙漠', pinyin: 'sha mo', definition: '干旱少雨的荒芜地区' },
  { word: '月光', pinyin: 'yue guang', definition: '月亮的光芒' },
  { word: '阳光', pinyin: 'yang guang', definition: '太阳的光线' },
  { word: '星光', pinyin: 'xing guang', definition: '星星的光芒' },
  { word: '日出', pinyin: 'ri chu', definition: '太阳升起' },
  { word: '日落', pinyin: 'ri luo', definition: '太阳落下' },
  { word: '月光', pinyin: 'yue guang', definition: '月亮的光芒' },
  { word: '月色', pinyin: 'yue se', definition: '月光下的景色' },
  { word: '月球', pinyin: 'yue qiu', definition: '地球的卫星' },
  { word: '明亮', pinyin: 'ming liang', definition: '光线充足；光亮' },
  { word: '光明', pinyin: 'guang ming', definition: '光亮；正义和希望' },
  { word: '光芒', pinyin: 'guang mang', definition: '放射的亮光' },
  { word: '风光', pinyin: 'feng guang', definition: '风景；景象' },
  { word: '风水', pinyin: 'feng shui', definition: '中国传统的地理选址学说' },
  { word: '风云', pinyin: 'feng yun', definition: '风和云；比喻变幻的局势' },
  { word: '风声', pinyin: 'feng sheng', definition: '风的声音；传闻' },
  { word: '雪山', pinyin: 'xue shan', definition: '覆盖着积雪的山' },
  { word: '雪地', pinyin: 'xue di', definition: '被雪覆盖的地面' },
  { word: '雨水', pinyin: 'yu shui', definition: '从云层降下的水' },
  { word: '雨季', pinyin: 'yu ji', definition: '多雨的季节' },
  { word: '云彩', pinyin: 'yun cai', definition: '云的美称' },
  { word: '白云', pinyin: 'bai yun', definition: '白色的云' },
  { word: '云层', pinyin: 'yun ceng', definition: '天空中的云层' },
  { word: '春风', pinyin: 'chun feng', definition: '春天温暖的风' },
  { word: '春雨', pinyin: 'chun yu', definition: '春季下的雨' },
  { word: '秋叶', pinyin: 'qiu ye', definition: '秋天的落叶' },
  { word: '秋意', pinyin: 'qiu yi', definition: '秋天的气息和感觉' },
  { word: '花色', pinyin: 'hua se', definition: '花朵的颜色和图案' },
  { word: '花开', pinyin: 'hua kai', definition: '花朵盛开' },
  { word: '花草', pinyin: 'hua cao', definition: '花卉和草类的统称' },
  { word: '花园', pinyin: 'hua yuan', definition: '种植花草的园地' },

  // 情感
  { word: '爱情', pinyin: 'ai qing', definition: '男女之间的深厚情感' },
  { word: '幸福', pinyin: 'xing fu', definition: '内心满足的愉悦状态' },
  { word: '快乐', pinyin: 'kuai le', definition: '愉快欢乐的心情' },
  { word: '悲伤', pinyin: 'bei shang', definition: '伤心难过的情绪' },
  { word: '思念', pinyin: 'si nian', definition: '对远方的人或事物的想念' },
  { word: '孤独', pinyin: 'gu du', definition: '独自一人；寂寞的感觉' },
  { word: '勇气', pinyin: 'yong qi', definition: '面对困难的胆量和决心' },
  { word: '希望', pinyin: 'xi wang', definition: '对未来的美好期待' },
  { word: '梦想', pinyin: 'meng xiang', definition: '理想的追求；愿望' },
  { word: '热情', pinyin: 're qing', definition: '热烈的情感或态度' },
  { word: '温柔', pinyin: 'wen rou', definition: '温和柔顺的性格' },
  { word: '愤怒', pinyin: 'fen nu', definition: '因不满而产生的激烈情绪' },
  { word: '恐惧', pinyin: 'kong ju', definition: '面对危险时的害怕心理' },
  { word: '惊喜', pinyin: 'jing xi', definition: '意外的高兴' },
  { word: '忧伤', pinyin: 'you shang', definition: '忧愁悲伤' },
  { word: '爱心', pinyin: 'ai xin', definition: '关爱他人的心' },
  { word: '恋爱', pinyin: 'lian ai', definition: '男女相爱' },
  { word: '热爱', pinyin: 're ai', definition: '热烈地爱' },
  { word: '可爱', pinyin: 'ke ai', definition: '令人喜爱' },
  { word: '幸运', pinyin: 'xing yun', definition: '好运气；福气' },
  { word: '好运', pinyin: 'hao yun', definition: '好运气' },
  { word: '快速', pinyin: 'kuai su', definition: '速度快' },
  { word: '乐趣', pinyin: 'le qu', definition: '使人感到快乐的趣味' },
  { word: '伤心', pinyin: 'shang xin', definition: '心里难过' },
  { word: '心事', pinyin: 'xin shi', definition: '心里想的事情（多指令人担忧的）' },
  { word: '心情', pinyin: 'xin qing', definition: '内心的情绪状态' },
  { word: '心思', pinyin: 'xin si', definition: '内心的想法和念头' },
  { word: '勇敢', pinyin: 'yong gan', definition: '有勇气和胆量' },
  { word: '失望', pinyin: 'shi wang', definition: '希望落空后感到沮丧' },
  { word: '盼望', pinyin: 'pan wang', definition: '殷切地期望' },
  { word: '梦幻', pinyin: 'meng huan', definition: '如梦般奇幻' },
  { word: '无情', pinyin: 'wu qing', definition: '没有感情' },
  { word: '友情', pinyin: 'you qing', definition: '朋友之间的情谊' },
  { word: '温情', pinyin: 'wen qing', definition: '温柔的情感' },
  { word: '生气', pinyin: 'sheng qi', definition: '因不满而不高兴' },
  { word: '恐慌', pinyin: 'kong huang', definition: '因害怕而慌张' },
  { word: '害怕', pinyin: 'hai pa', definition: '遇到困难或危险时心中不安' },
  { word: '惊人', pinyin: 'jing ren', definition: '使人吃惊' },
  { word: '惊吓', pinyin: 'jing xia', definition: '因意外而受惊' },
  { word: '忧愁', pinyin: 'you chou', definition: '忧虑愁苦' },
  { word: '忧虑', pinyin: 'you lv', definition: '忧愁担心' },

  // 人物与关系
  { word: '朋友', pinyin: 'peng you', definition: '彼此有交情的人' },
  { word: '家人', pinyin: 'jia ren', definition: '家庭成员' },
  { word: '老师', pinyin: 'lao shi', definition: '传授知识的人' },
  { word: '孩子', pinyin: 'hai zi', definition: '儿童；子女' },
  { word: '英雄', pinyin: 'ying xiong', definition: '有杰出贡献或勇敢的人' },
  { word: '诗人', pinyin: 'shi ren', definition: '写诗的创作者' },
  { word: '画家', pinyin: 'hua jia', definition: '从事绘画创作的艺术家' },
  { word: '歌手', pinyin: 'ge shou', definition: '以歌唱为职业的人' },
  { word: '作家', pinyin: 'zuo jia', definition: '从事文学创作的人' },
  { word: '医生', pinyin: 'yi sheng', definition: '从事医疗工作的人' },
  { word: '母亲', pinyin: 'mu qin', definition: '妈妈；孕育生命的人' },
  { word: '父亲', pinyin: 'fu qin', definition: '爸爸；一家之主' },
  { word: '少年', pinyin: 'shao nian', definition: '年轻的男孩子' },
  { word: '老人', pinyin: 'lao ren', definition: '年纪大的人' },
  { word: '知己', pinyin: 'zhi ji', definition: '了解自己的亲密朋友' },
  { word: '友人', pinyin: 'you ren', definition: '朋友' },
  { word: '友好', pinyin: 'you hao', definition: '亲近和睦' },
  { word: '人家', pinyin: 'ren jia', definition: '住户；别人' },
  { word: '家乡', pinyin: 'jia xiang', definition: '故乡' },
  { word: '家长', pinyin: 'jia zhang', definition: '父母或其他监护人' },
  { word: '老家', pinyin: 'lao jia', definition: '原籍；故乡' },
  { word: '师生', pinyin: 'shi sheng', definition: '老师和学生' },
  { word: '童年', pinyin: 'tong nian', definition: '儿童时代' },
  { word: '青年', pinyin: 'qing nian', definition: '十几到二十几岁的年龄段' },
  { word: '英勇', pinyin: 'ying yong', definition: '非常勇敢' },
  { word: '诗歌', pinyin: 'shi ge', definition: '用韵律语言表达的文学形式' },
  { word: '画廊', pinyin: 'hua lang', definition: '展示画作的场所' },
  { word: '歌声', pinyin: 'ge sheng', definition: '唱歌的声音' },
  { word: '歌曲', pinyin: 'ge qu', definition: '供人歌唱的作品' },
  { word: '作品', pinyin: 'zuo pin', definition: '创作的成品' },
  { word: '父母', pinyin: 'fu mu', definition: '父亲和母亲' },

  // 抽象概念
  { word: '时间', pinyin: 'shi jian', definition: '物质运动的持续性和顺序性' },
  { word: '生命', pinyin: 'sheng ming', definition: '生物所具有的活动能力' },
  { word: '自由', pinyin: 'zi you', definition: '不受约束和限制的状态' },
  { word: '命运', pinyin: 'ming yun', definition: '人生的际遇和发展轨迹' },
  { word: '记忆', pinyin: 'ji yi', definition: '大脑对过去经验的保留和再现' },
  { word: '未来', pinyin: 'wei lai', definition: '尚未到来的时间' },
  { word: '过去', pinyin: 'guo qu', definition: '已经流逝的时间' },
  { word: '世界', pinyin: 'shi jie', definition: '地球上所有地方和事物的总称' },
  { word: '历史', pinyin: 'li shi', definition: '过去发生的事件和发展过程' },
  { word: '文化', pinyin: 'wen hua', definition: '人类创造的精神和物质财富总和' },
  { word: '艺术', pinyin: 'yi shu', definition: '用形象反映现实的创作活动' },
  { word: '科学', pinyin: 'ke xue', definition: '系统化的知识体系和研究方法' },
  { word: '真理', pinyin: 'zhen li', definition: '客观事物及其规律的正确认识' },
  { word: '智慧', pinyin: 'zhi hui', definition: '辨别是非、解决问题的能力' },
  { word: '灵魂', pinyin: 'ling hun', definition: '精神或心灵的内核' },
  { word: '永恒', pinyin: 'yong heng', definition: '永远不变的；永久的' },
  { word: '和平', pinyin: 'he ping', definition: '没有战争或冲突的状态' },
  { word: '战争', pinyin: 'zhan zheng', definition: '大规模的武装冲突' },
  { word: '文明', pinyin: 'wen ming', definition: '社会发展到较高阶段的状态' },
  { word: '力量', pinyin: 'li liang', definition: '力气；能力；作用' },
  { word: '时光', pinyin: 'shi guang', definition: '时间；光阴' },
  { word: '时代', pinyin: 'shi dai', definition: '具有某种特征的历史时期' },
  { word: '时空', pinyin: 'shi kong', definition: '时间和空间' },
  { word: '生活', pinyin: 'sheng huo', definition: '人或生物为了生存和发展而进行的各种活动' },
  { word: '生日', pinyin: 'sheng ri', definition: '人出生的日子' },
  { word: '自然', pinyin: 'zi ran', definition: '自然界；不勉强' },
  { word: '自在', pinyin: 'zi zai', definition: '自由舒适' },
  { word: '运气', pinyin: 'yun qi', definition: '幸运或不幸的遭遇' },
  { word: '回忆', pinyin: 'hui yi', definition: '回想过去的事' },
  { word: '记住', pinyin: 'ji zhu', definition: '记在心里不忘记' },
  { word: '将来', pinyin: 'jiang lai', definition: '未来；以后' },
  { word: '人间', pinyin: 'ren jian', definition: '人类社会' },
  { word: '经历', pinyin: 'jing li', definition: '亲身遇到过的事' },
  { word: '文艺', pinyin: 'wen yi', definition: '文学和艺术' },
  { word: '科技', pinyin: 'ke ji', definition: '科学技术' },
  { word: '真相', pinyin: 'zhen xiang', definition: '事物的真实情况' },
  { word: '智力', pinyin: 'zhi li', definition: '认识理解事物的能力' },
  { word: '心灵', pinyin: 'xin ling', definition: '内心精神世界' },
  { word: '永久', pinyin: 'yong jiu', definition: '长久持续' },
  { word: '和睦', pinyin: 'he mu', definition: '相处融洽' },
  { word: '战场', pinyin: 'zhan chang', definition: '交战的地方' },
  { word: '力气', pinyin: 'li qi', definition: '体力' },

  // 动作与行为
  { word: '旅行', pinyin: 'lv xing', definition: '到外地游览观光' },
  { word: '学习', pinyin: 'xue xi', definition: '获取知识或技能的过程' },
  { word: '思考', pinyin: 'si kao', definition: '深入地进行思维活动' },
  { word: '创造', pinyin: 'chuang zao', definition: '做出前所未有的事物' },
  { word: '探索', pinyin: 'tan suo', definition: '多方寻求答案或发现未知' },
  { word: '飞翔', pinyin: 'fei xiang', definition: '在空中飞行；自由翱翔' },
  { word: '奔跑', pinyin: 'ben pao', definition: '快速跑步前进' },
  { word: '歌唱', pinyin: 'ge chang', definition: '唱歌；抒发情感' },
  { word: '舞蹈', pinyin: 'wu dao', definition: '用身体动作表达的艺术' },
  { word: '写作', pinyin: 'xie zuo', definition: '进行文字创作' },
  { word: '绘画', pinyin: 'hui hua', definition: '用画笔创作图像' },
  { word: '阅读', pinyin: 'yue du', definition: '看书或文字材料' },
  { word: '倾听', pinyin: 'qing ting', definition: '仔细认真地听' },
  { word: '拥抱', pinyin: 'yong bao', definition: '用双臂环抱对方' },
  { word: '追逐', pinyin: 'zhui zhu', definition: '追赶；追求' },
  { word: '旅游', pinyin: 'lv you', definition: '旅行游览' },
  { word: '学生', pinyin: 'xue sheng', definition: '在校学习的人' },
  { word: '思想', pinyin: 'si xiang', definition: '理性认识；念头' },
  { word: '创新', pinyin: 'chuang xin', definition: '创造新的' },
  { word: '探究', pinyin: 'tan jiu', definition: '探索追究' },
  { word: '飞行', pinyin: 'fei xing', definition: '在空中的移动' },
  { word: '奔驰', pinyin: 'ben chi', definition: '快速奔跑' },
  { word: '歌舞', pinyin: 'ge wu', definition: '唱歌跳舞' },
  { word: '舞台', pinyin: 'wu tai', definition: '表演用的台子' },
  { word: '书写', pinyin: 'shu xie', definition: '写字' },
  { word: '读者', pinyin: 'du zhe', definition: '阅读的人' },
  { word: '聆听', pinyin: 'ling ting', definition: '恭敬地听' },
  { word: '拥有', pinyin: 'yong you', definition: '具有；领有' },
  { word: '追求', pinyin: 'zhui qiu', definition: '努力争取' },

  // 地点与场所
  { word: '城市', pinyin: 'cheng shi', definition: '人口密集的大型居住区' },
  { word: '乡村', pinyin: 'xiang cun', definition: '农村地区' },
  { word: '家园', pinyin: 'jia yuan', definition: '居住的地方；故乡' },
  { word: '学校', pinyin: 'xue xiao', definition: '进行教育的机构' },
  { word: '医院', pinyin: 'yi yuan', definition: '治疗疾病的场所' },
  { word: '书店', pinyin: 'shu dian', definition: '销售书籍的商店' },
  { word: '海边', pinyin: 'hai bian', definition: '海的边缘地带' },
  { word: '山顶', pinyin: 'shan ding', definition: '山的顶部' },
  { word: '市场', pinyin: 'shi chang', definition: '商品交易的场所' },
  { word: '宇宙', pinyin: 'yu zhou', definition: '包含一切物质和能量的空间' },
  { word: '天堂', pinyin: 'tian tang', definition: '宗教中的极乐世界' },
  { word: '故乡', pinyin: 'gu xiang', definition: '出生或成长的地方' },
  { word: '远方', pinyin: 'yuan fang', definition: '遥远的地方' },
  { word: '都市', pinyin: 'du shi', definition: '大城市' },
  { word: '书法', pinyin: 'shu fa', definition: '汉字的书写艺术' },
  { word: '海岸', pinyin: 'hai an', definition: '陆地靠海的部分' },
  { word: '山谷', pinyin: 'shan gu', definition: '山间的谷地' },
  { word: '广场', pinyin: 'guang chang', definition: '宽阔的公共空间' },
  { word: '太空', pinyin: 'tai kong', definition: '外层空间' },
  { word: '天气', pinyin: 'tian qi', definition: '气象变化' },
  { word: '故人', pinyin: 'gu ren', definition: '老朋友' },
  { word: '远离', pinyin: 'yuan li', definition: '远远离开' },

  // 物品
  { word: '书籍', pinyin: 'shu ji', definition: '装订成册的著作' },
  { word: '音乐', pinyin: 'yin yue', definition: '有组织的乐音艺术' },
  { word: '电影', pinyin: 'dian ying', definition: '用影像讲述故事的艺术形式' },
  { word: '照片', pinyin: 'zhao pian', definition: '用相机拍摄的图片' },
  { word: '信件', pinyin: 'xin jian', definition: '写给别人的书信' },
  { word: '日记', pinyin: 'ri ji', definition: '每天记录的生活笔记' },
  { word: '镜子', pinyin: 'jing zi', definition: '能反射影像的光滑物体' },
  { word: '钥匙', pinyin: 'yao shi', definition: '开锁的工具' },
  { word: '灯火', pinyin: 'deng huo', definition: '灯光；照明' },
  { word: '颜色', pinyin: 'yan se', definition: '光波作用于人眼产生的视觉感受' },
  { word: '声音', pinyin: 'sheng yin', definition: '由振动产生的听觉感受' },
  { word: '味道', pinyin: 'wei dao', definition: '味觉感受到的滋味' },
  { word: '故事', pinyin: 'gu shi', definition: '叙述的事件或情节' },
  { word: '礼物', pinyin: 'li wu', definition: '赠送给他人的物品' },
  { word: '秘密', pinyin: 'mi mi', definition: '不为人知的事情' },
  { word: '宝藏', pinyin: 'bao zang', definition: '埋藏的财宝' },
  { word: '影子', pinyin: 'ying zi', definition: '物体挡住光线形成的暗影' },
  { word: '书本', pinyin: 'shu ben', definition: '书籍的统称' },
  { word: '电子', pinyin: 'dian zi', definition: '与电子技术相关的' },
  { word: '镜头', pinyin: 'jing tou', definition: '拍摄的光学部件' },
  { word: '灯光', pinyin: 'deng guang', definition: '灯发出的光' },
  { word: '色彩', pinyin: 'se cai', definition: '各种颜色的总称' },
  { word: '气味', pinyin: 'qi wei', definition: '嗅觉感受' },
  { word: '事故', pinyin: 'shi gu', definition: '意外事件' },
  { word: '礼仪', pinyin: 'li yi', definition: '礼节和仪式' },
  { word: '神秘', pinyin: 'shen mi', definition: '不可测的' },
  { word: '宝石', pinyin: 'bao shi', definition: '珍贵的矿物' },
  { word: '光线', pinyin: 'guang xian', definition: '传播方向的光束' },
  { word: '影响', pinyin: 'ying xiang', definition: '对他物的作用' },
  { word: '日历', pinyin: 'ri li', definition: '记录年月日的册子' },
  { word: '明星', pinyin: 'ming xing', definition: '有名的演员或歌手' },
  { word: '风筝', pinyin: 'feng zheng', definition: '用线牵引的飞行玩具' },
];

// 去重
const seen = new Set();
const dictionary = rawWords.filter(w => {
  if (seen.has(w.word)) return false;
  seen.add(w.word);
  return true;
});

// 构建倒排索引
const charIndex = {};
for (let i = 0; i < dictionary.length; i++) {
  const chars = extractChars(dictionary[i].word);
  for (const ch of chars) {
    if (!charIndex[ch]) charIndex[ch] = [];
    charIndex[ch].push(i);
  }
}

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 写入文件
fs.writeFileSync(DICT_OUTPUT, JSON.stringify(dictionary), 'utf-8');
const dictSize = (fs.statSync(DICT_OUTPUT).size / 1024).toFixed(0);
console.log(`dictionary.json — ${dictSize} KB, ${dictionary.length} 个词语`);

fs.writeFileSync(INDEX_OUTPUT, JSON.stringify(charIndex), 'utf-8');
const indexSize = (fs.statSync(INDEX_OUTPUT).size / 1024).toFixed(0);
console.log(`charIndex.json — ${indexSize} KB, ${Object.keys(charIndex).length} 个汉字`);

console.log('✅ 词典生成完成！');
