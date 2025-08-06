// 修复剩余的中文路径引用问题
// Copyright (C) 2024 Lipeaks FC Games

const fs = require('fs');
const path = require('path');

// 扩展的中文拼音映射表
const extendedPinyinMap = {
  // 添加遗漏的常用汉字
  '知': 'zhi', '识': 'shi', '学': 'xue', '习': 'xi', '工': 'gong', '作': 'zuo',
  '生': 'sheng', '活': 'huo', '家': 'jia', '庭': 'ting', '朋': 'peng', '友': 'you',
  '老': 'lao', '师': 'shi', '同': 'tong', '学': 'xue', '父': 'fu', '母': 'mu',
  '兄': 'xiong', '弟': 'di', '姐': 'jie', '妹': 'mei', '叔': 'shu', '阿': 'a',
  '爷': 'ye', '奶': 'nai', '爸': 'ba', '妈': 'ma', '哥': 'ge', '姨': 'yi',
  '舅': 'jiu', '姑': 'gu', '嫂': 'sao', '孙': 'sun', '女': 'nv', '儿': 'er',
  '男': 'nan', '孩': 'hai', '小': 'xiao', '青': 'qing', '年': 'nian', '中': 'zhong',
  '思': 'si', '想': 'xiang', '感': 'gan', '情': 'qing', '心': 'xin', '理': 'li',
  '头': 'tou', '脑': 'nao', '眼': 'yan', '睛': 'jing', '鼻': 'bi', '嘴': 'zui',
  '耳': 'er', '朵': 'duo', '手': 'shou', '脚': 'jiao', '身': 'shen', '体': 'ti',
  '山': 'shan', '水': 'shui', '火': 'huo', '土': 'tu', '木': 'mu', '金': 'jin',
  '石': 'shi', '草': 'cao', '花': 'hua', '树': 'shu', '林': 'lin', '森': 'sen',
  '雨': 'yu', '雪': 'xue', '风': 'feng', '云': 'yun', '雷': 'lei', '电': 'dian',
  '日': 'ri', '月': 'yue', '星': 'xing', '天': 'tian', '地': 'di', '海': 'hai',
  '江': 'jiang', '河': 'he', '湖': 'hu', '泊': 'bo', '池': 'chi', '溪': 'xi',
  '东': 'dong', '南': 'nan', '西': 'xi', '北': 'bei', '上': 'shang', '下': 'xia',
  '左': 'zuo', '右': 'you', '前': 'qian', '后': 'hou', '里': 'li', '外': 'wai',
  '内': 'nei', '间': 'jian', '边': 'bian', '旁': 'pang', '侧': 'ce', '角': 'jiao',
  '处': 'chu', '所': 'suo', '位': 'wei', '置': 'zhi', '方': 'fang', '向': 'xiang',
  '路': 'lu', '街': 'jie', '道': 'dao', '巷': 'xiang', '院': 'yuan', '室': 'shi',
  '门': 'men', '窗': 'chuang', '墙': 'qiang', '屋': 'wu', '房': 'fang', '厅': 'ting',
  '床': 'chuang', '桌': 'zhuo', '椅': 'yi', '柜': 'gui', '箱': 'xiang', '包': 'bao',
  '袋': 'dai', '盒': 'he', '瓶': 'ping', '杯': 'bei', '碗': 'wan', '盘': 'pan',
  '碟': 'die', '筷': 'kuai', '勺': 'shao', '叉': 'cha', '刀': 'dao', '剪': 'jian',
  '笔': 'bi', '纸': 'zhi', '书': 'shu', '本': 'ben', '册': 'ce', '页': 'ye',
  '章': 'zhang', '节': 'jie', '段': 'duan', '句': 'ju', '词': 'ci', '字': 'zi',
  '号': 'hao', '码': 'ma', '数': 'shu', '量': 'liang', '个': 'ge', '只': 'zhi',
  '些': 'xie', '多': 'duo', '少': 'shao', '几': 'ji', '什': 'shen', '么': 'me',
  '谁': 'shei', '哪': 'na', '那': 'na', '这': 'zhe', '它': 'ta', '他': 'ta',
  '她': 'ta', '我': 'wo', '你': 'ni', '您': 'nin', '们': 'men', '自': 'zi',
  '己': 'ji', '别': 'bie', '其': 'qi', '每': 'mei', '各': 'ge', '种': 'zhong',
  '样': 'yang', '类': 'lei', '般': 'ban', '常': 'chang', '平': 'ping', '普': 'pu',
  '通': 'tong', '正': 'zheng', '真': 'zhen', '实': 'shi', '际': 'ji', '确': 'que',
  '定': 'ding', '准': 'zhun', '精': 'jing', '细': 'xi', '详': 'xiang', '具': 'ju',
  '体': 'ti', '清': 'qing', '楚': 'chu', '明': 'ming', '白': 'bai', '亮': 'liang',
  '暗': 'an', '黑': 'hei', '灰': 'hui', '红': 'hong', '橙': 'cheng', '黄': 'huang',
  '绿': 'lv', '青': 'qing', '蓝': 'lan', '紫': 'zi', '粉': 'fen', '棕': 'zong',
  '咖': 'ka', '啡': 'fei', '色': 'se', '彩': 'cai', '光': 'guang', '影': 'ying',
  '形': 'xing', '状': 'zhuang', '圆': 'yuan', '方': 'fang', '长': 'chang', '短': 'duan',
  '高': 'gao', '矮': 'ai', '厚': 'hou', '薄': 'bao', '粗': 'cu', '细': 'xi',
  '宽': 'kuan', '窄': 'zhai', '深': 'shen', '浅': 'qian', '重': 'zhong', '轻': 'qing',
  '硬': 'ying', '软': 'ruan', '滑': 'hua', '粗': 'cu', '糙': 'cao', '光': 'guang',
  '滑': 'hua', '热': 're', '凉': 'liang', '温': 'wen', '冷': 'leng', '冰': 'bing',
  '甜': 'tian', '酸': 'suan', '苦': 'ku', '辣': 'la', '咸': 'xian', '淡': 'dan',
  '香': 'xiang', '臭': 'chou', '好': 'hao', '坏': 'huai', '对': 'dui', '错': 'cuo',
  '是': 'shi', '非': 'fei', '新': 'xin', '旧': 'jiu', '干': 'gan', '净': 'jing',
  '脏': 'zang', '忙': 'mang', '闲': 'xian', '早': 'zao', '晚': 'wan', '快': 'kuai',
  '慢': 'man', '急': 'ji', '缓': 'huan', '安': 'an', '危': 'wei', '险': 'xian',
  '全': 'quan', '健': 'jian', '康': 'kang', '病': 'bing', '累': 'lei', '困': 'kun',
  '饿': 'e', '渴': 'ke', '饱': 'bao', '满': 'man', '空': 'kong', '虚': 'xu',
  '实': 'shi', '充': 'chong', '足': 'zu', '够': 'gou', '缺': 'que', '乏': 'fa',
  '穷': 'qiong', '富': 'fu', '贵': 'gui', '贱': 'jian', '便': 'bian', '宜': 'yi',
  '昂': 'ang', '贵': 'gui', '免': 'mian', '费': 'fei', '收': 'shou', '付': 'fu',
  '买': 'mai', '卖': 'mai', '换': 'huan', '租': 'zu', '借': 'jie', '还': 'huan',
  '欠': 'qian', '债': 'zhai', '存': 'cun', '取': 'qu', '花': 'hua', '费': 'fei',
  '省': 'sheng', '节': 'jie', '约': 'yue', '浪': 'lang', '费': 'fei', '用': 'yong',
  '需': 'xu', '要': 'yao', '必': 'bi', '须': 'xu', '应': 'ying', '该': 'gai',
  '能': 'neng', '会': 'hui', '可': 'ke', '以': 'yi', '行': 'xing', '得': 'de',
  '到': 'dao', '达': 'da', '成': 'cheng', '功': 'gong', '败': 'bai', '胜': 'sheng',
  '负': 'fu', '赢': 'ying', '输': 'shu', '平': 'ping', '等': 'deng', '同': 'tong',
  '异': 'yi', '差': 'cha', '别': 'bie', '像': 'xiang', '似': 'si', '如': 'ru',
  '比': 'bi', '较': 'jiao', '更': 'geng', '最': 'zui', '很': 'hen', '太': 'tai',
  '十': 'shi', '分': 'fen', '非': 'fei', '常': 'chang', '特': 'te', '格': 'ge',
  '外': 'wai', '另': 'ling', '还': 'hai', '再': 'zai', '又': 'you', '也': 'ye',
  '都': 'dou', '只': 'zhi', '就': 'jiu', '才': 'cai', '刚': 'gang', '已': 'yi',
  '经': 'jing', '曾': 'zeng', '正': 'zheng', '在': 'zai', '着': 'zhe', '了': 'le',
  '过': 'guo', '来': 'lai', '去': 'qu', '回': 'hui', '出': 'chu', '进': 'jin',
  '入': 'ru', '开': 'kai', '关': 'guan', '停': 'ting', '始': 'shi', '终': 'zhong',
  '结': 'jie', '束': 'shu', '完': 'wan', '毕': 'bi', '做': 'zuo', '干': 'gan',
  '办': 'ban', '事': 'shi', '情': 'qing', '况': 'kuang', '题': 'ti', '目': 'mu',
  '问': 'wen', '答': 'da', '解': 'jie', '决': 'jue', '处': 'chu', '理': 'li',
  '治': 'zhi', '疗': 'liao', '医': 'yi', '药': 'yao', '打': 'da', '针': 'zhen',
  '手': 'shou', '术': 'shu', '检': 'jian', '查': 'cha', '验': 'yan', '诊': 'zhen',
  '断': 'duan', '病': 'bing', '症': 'zheng', '状': 'zhuang', '疼': 'teng', '痛': 'tong',
  '酸': 'suan', '胀': 'zhang', '麻': 'ma', '木': 'mu', '晕': 'yun', '恶': 'e',
  '心': 'xin', '吐': 'tu', '咳': 'ke', '嗽': 'sou', '发': 'fa', '烧': 'shao',
  '低': 'di', '烧': 'shao', '感': 'gan', '冒': 'mao', '流': 'liu', '鼻': 'bi',
  '涕': 'ti', '打': 'da', '喷': 'pen', '嚏': 'ti', '咽': 'yan', '喉': 'hou',
  '肿': 'zhong', '痒': 'yang', '红': 'hong', '肿': 'zhong', '过': 'guo', '敏': 'min',
  '吃': 'chi', '喝': 'he', '睡': 'shui', '觉': 'jiao', '起': 'qi', '床': 'chuang',
  '洗': 'xi', '澡': 'zao', '刷': 'shua', '牙': 'ya', '梳': 'shu', '头': 'tou',
  '穿': 'chuan', '衣': 'yi', '服': 'fu', '脱': 'tuo', '换': 'huan', '戴': 'dai',
  '帽': 'mao', '围': 'wei', '巾': 'jin', '鞋': 'xie', '袜': 'wa', '裤': 'ku',
  '裙': 'qun', '衬': 'chen', '衫': 'shan', '外': 'wai', '套': 'tao', '毛': 'mao',
  '衣': 'yi', '背': 'bei', '心': 'xin', '内': 'nei', '裤': 'ku', '胸': 'xiong',
  '罩': 'zhao', '领': 'ling', '带': 'dai', '扣': 'kou', '子': 'zi', '拉': 'la',
  '链': 'lian', '魔': 'mo', '术': 'shu', '贴': 'tie', '纽': 'niu', '扣': 'kou',
  '按': 'an', '钮': 'niu', '开': 'kai', '关': 'guan', '锁': 'suo', '钥': 'yao',
  '匙': 'shi', '门': 'men', '铃': 'ling', '电': 'dian', '话': 'hua', '手': 'shou',
  '机': 'ji', '电': 'dian', '脑': 'nao', '键': 'jian', '盘': 'pan', '鼠': 'shu',
  '标': 'biao', '屏': 'ping', '幕': 'mu', '显': 'xian', '示': 'shi', '器': 'qi',
  '打': 'da', '印': 'yin', '机': 'ji', '复': 'fu', '印': 'yin', '传': 'chuan',
  '真': 'zhen', '扫': 'sao', '描': 'miao', '仪': 'yi', '照': 'zhao', '相': 'xiang',
  '机': 'ji', '摄': 'she', '像': 'xiang', '头': 'tou', '录': 'lu', '音': 'yin',
  '笔': 'bi', '播': 'bo', '放': 'fang', '器': 'qi', '音': 'yin', '响': 'xiang',
  '耳': 'er', '机': 'ji', '话': 'hua', '筒': 'tong', '麦': 'mai', '克': 'ke',
  '风': 'feng', '扬': 'yang', '声': 'sheng', '器': 'qi', '收': 'shou', '音': 'yin',
  '机': 'ji', '电': 'dian', '视': 'shi', '台': 'tai', '遥': 'yao', '控': 'kong',
  '器': 'qi', '空': 'kong', '调': 'tiao', '冰': 'bing', '箱': 'xiang', '洗': 'xi',
  '衣': 'yi', '机': 'ji', '微': 'wei', '波': 'bo', '炉': 'lu', '电': 'dian',
  '饭': 'fan', '煲': 'bao', '热': 're', '水': 'shui', '器': 'qi', '吹': 'chui',
  '风': 'feng', '机': 'ji', '吸': 'xi', '尘': 'chen', '器': 'qi', '扫': 'sao',
  '地': 'di', '机': 'ji', '器': 'qi', '人': 'ren', '汽': 'qi', '车': 'che',
  '自': 'zi', '行': 'xing', '车': 'che', '摩': 'mo', '托': 'tuo', '车': 'che',
  '公': 'gong', '共': 'gong', '汽': 'qi', '车': 'che', '地': 'di', '铁': 'tie',
  '火': 'huo', '车': 'che', '飞': 'fei', '机': 'ji', '船': 'chuan', '艇': 'ting',
  '轮': 'lun', '船': 'chuan', '帆': 'fan', '船': 'chuan', '救': 'jiu', '生': 'sheng',
  '艇': 'ting', '橡': 'xiang', '皮': 'pi', '艇': 'ting', '潜': 'qian', '艇': 'ting',
  '战': 'zhan', '斗': 'dou', '机': 'ji', '轰': 'hong', '炸': 'zha', '机': 'ji',
  '直': 'zhi', '升': 'sheng', '机': 'ji', '运': 'yun', '输': 'shu', '机': 'ji',
  '客': 'ke', '机': 'ji', '货': 'huo', '机': 'ji', '救': 'jiu', '护': 'hu',
  '车': 'che', '消': 'xiao', '防': 'fang', '车': 'che', '警': 'jing', '车': 'che',
  '出': 'chu', '租': 'zu', '车': 'che', '校': 'xiao', '车': 'che', '工': 'gong',
  '程': 'cheng', '车': 'che', '推': 'tui', '土': 'tu', '机': 'ji', '挖': 'wa',
  '掘': 'jue', '机': 'ji', '起': 'qi', '重': 'zhong', '机': 'ji', '塔': 'ta',
  '吊': 'diao', '叉': 'cha', '车': 'che', '铲': 'chan', '车': 'che', '拖': 'tuo',
  '拉': 'la', '机': 'ji', '联': 'lian', '合': 'he', '收': 'shou', '割': 'ge',
  '机': 'ji', '播': 'bo', '种': 'zhong', '机': 'ji', '犁': 'li', '耙': 'pa',
  '农': 'nong', '业': 'ye', '机': 'ji', '械': 'xie', '工': 'gong', '业': 'ye',
  '机': 'ji', '器': 'qi', '设': 'she', '备': 'bei', '仪': 'yi', '器': 'qi',
  '仪': 'yi', '表': 'biao', '量': 'liang', '具': 'ju', '工': 'gong', '具': 'ju',
  '零': 'ling', '件': 'jian', '配': 'pei', '件': 'jian', '材': 'cai', '料': 'liao',
  '原': 'yuan', '料': 'liao', '燃': 'ran', '料': 'liao', '产': 'chan', '品': 'pin',
  '商': 'shang', '品': 'pin', '货': 'huo', '物': 'wu', '包': 'bao', '装': 'zhuang',
  '容': 'rong', '器': 'qi', '袋': 'dai', '装': 'zhuang', '瓶': 'ping', '装': 'zhuang',
  '罐': 'guan', '装': 'zhuang', '盒': 'he', '装': 'zhuang', '散': 'san', '装': 'zhuang',
  '批': 'pi', '发': 'fa', '零': 'ling', '售': 'shou', '专': 'zhuan', '卖': 'mai',
  '店': 'dian', '超': 'chao', '市': 'shi', '商': 'shang', '场': 'chang', '购': 'gou',
  '物': 'wu', '中': 'zhong', '心': 'xin', '百': 'bai', '货': 'huo', '公': 'gong',
  '司': 'si', '商': 'shang', '店': 'dian', '铺': 'pu', '摊': 'tan', '位': 'wei',
  '柜': 'gui', '台': 'tai', '收': 'shou', '银': 'yin', '台': 'tai', '收': 'shou',
  '款': 'kuan', '机': 'ji', '找': 'zhao', '零': 'ling', '发': 'fa', '票': 'piao',
  '收': 'shou', '据': 'ju', '小': 'xiao', '票': 'piao', '账': 'zhang', '单': 'dan',
  '清': 'qing', '单': 'dan', '价': 'jia', '格': 'ge', '标': 'biao', '签': 'qian',
  '标': 'biao', '价': 'jia', '打': 'da', '折': 'zhe', '优': 'you', '惠': 'hui',
  '促': 'cu', '销': 'xiao', '特': 'te', '价': 'jia', '减': 'jian', '价': 'jia',
  '降': 'jiang', '价': 'jia', '涨': 'zhang', '价': 'jia', '调': 'tiao', '价': 'jia',
  '报': 'bao', '价': 'jia', '询': 'xun', '价': 'jia', '估': 'gu', '价': 'jia',
  '评': 'ping', '估': 'gu', '定': 'ding', '价': 'jia', '议': 'yi', '价': 'jia',
  '还': 'huan', '价': 'jia', '砍': 'kan', '价': 'jia', '谈': 'tan', '判': 'pan',
  '协': 'xie', '商': 'shang', '讨': 'tao', '论': 'lun', '决': 'jue', '定': 'ding',
  '同': 'tong', '意': 'yi', '反': 'fan', '对': 'dui', '支': 'zhi', '持': 'chi',
  '赞': 'zan', '成': 'cheng', '反': 'fan', '对': 'dui', '拒': 'ju', '绝': 'jue',
  '接': 'jie', '受': 'shou', '承': 'cheng', '认': 'ren', '否': 'fou', '认': 'ren',
  '肯': 'ken', '定': 'ding', '确': 'que', '实': 'shi', '否': 'fou', '定': 'ding',
  '怀': 'huai', '疑': 'yi', '相': 'xiang', '信': 'xin', '信': 'xin', '任': 'ren',
  '依': 'yi', '赖': 'lai', '依': 'yi', '靠': 'kao', '指': 'zhi', '望': 'wang',
  '希': 'xi', '望': 'wang', '期': 'qi', '望': 'wang', '盼': 'pan', '望': 'wang',
  '渴': 'ke', '望': 'wang', '梦': 'meng', '想': 'xiang', '理': 'li', '想': 'xiang',
  '目': 'mu', '标': 'biao', '目': 'mu', '的': 'de', '意': 'yi', '图': 'tu',
  '企': 'qi', '图': 'tu', '打': 'da', '算': 'suan', '计': 'ji', '划': 'hua',
  '安': 'an', '排': 'pai', '准': 'zhun', '备': 'bei', '预': 'yu', '备': 'bei',
  '筹': 'chou', '备': 'bei', '组': 'zu', '织': 'zhi', '安': 'an', '排': 'pai',
  '布': 'bu', '置': 'zhi', '设': 'she', '置': 'zhi', '安': 'an', '装': 'zhuang',
  '拆': 'chai', '卸': 'xie', '装': 'zhuang', '配': 'pei', '组': 'zu', '装': 'zhuang',
  '建': 'jian', '设': 'she', '建': 'jian', '造': 'zao', '建': 'jian', '立': 'li',
  '创': 'chuang', '建': 'jian', '成': 'cheng', '立': 'li', '设': 'she', '立': 'li',
  '建': 'jian', '筑': 'zhu', '房': 'fang', '屋': 'wu', '楼': 'lou', '房': 'fang',
  '大': 'da', '厦': 'sha', '大': 'da', '楼': 'lou', '高': 'gao', '楼': 'lou',
  '塔': 'ta', '楼': 'lou', '平': 'ping', '房': 'fang', '别': 'bie', '墅': 'shu',
  '公': 'gong', '寓': 'yu', '宿': 'su', '舍': 'she', '旅': 'lv', '馆': 'guan',
  '酒': 'jiu', '店': 'dian', '宾': 'bin', '馆': 'guan', '饭': 'fan', '店': 'dian',
  '餐': 'can', '厅': 'ting', '食': 'shi', '堂': 'tang', '厨': 'chu', '房': 'fang',
  '卫': 'wei', '生': 'sheng', '间': 'jian', '厕': 'ce', '所': 'suo', '洗': 'xi',
  '手': 'shou', '间': 'jian', '浴': 'yu', '室': 'shi', '淋': 'lin', '浴': 'yu',
  '间': 'jian', '桑': 'sang', '拿': 'na', '浴': 'yu', '蒸': 'zheng', '汽': 'qi',
  '浴': 'yu', '游': 'you', '泳': 'yong', '池': 'chi', '健': 'jian', '身': 'shen',
  '房': 'fang', '体': 'ti', '育': 'yu', '馆': 'guan', '运': 'yun', '动': 'dong',
  '场': 'chang', '球': 'qiu', '场': 'chang', '网': 'wang', '球': 'qiu', '场': 'chang',
  '篮': 'lan', '球': 'qiu', '场': 'chang', '足': 'zu', '球': 'qiu', '场': 'chang',
  '羽': 'yu', '毛': 'mao', '球': 'qiu', '场': 'chang', '乒': 'ping', '乓': 'pang',
  '球': 'qiu', '台': 'tai', '台': 'tai', '球': 'qiu', '桌': 'zhuo', '保': 'bao',
  '龄': 'ling', '球': 'qiu', '馆': 'guan', '溜': 'liu', '冰': 'bing', '场': 'chang',
  '滑': 'hua', '雪': 'xue', '场': 'chang', '跑': 'pao', '道': 'dao', '跑': 'pao',
  '步': 'bu', '机': 'ji', '健': 'jian', '身': 'shen', '器': 'qi', '材': 'cai'
};

// 合并原有的和扩展的拼音映射
const allPinyinMap = {
  // 原有的映射（从原脚本复制）
  '恶': 'e', '魔': 'mo', '城': 'cheng', '无': 'wu', '敌': 'di', '版': 'ban',
  '古': 'gu', '巴': 'ba', '战': 'zhan', '士': 'shi', '闪': 'shan', '烁': 'shuo', '不': 'bu', '死': 'si',
  '能': 'neng', '源': 'yuan', '有': 'you', '限': 'xian', '生': 'sheng', '命': 'ming', '血': 'xue',
  '人': 'ren', '物': 'wu', '骷': 'ku', '髅': 'lou', '僵': 'jiang', '尸': 'shi',
  '冒': 'mao', '险': 'xian', '岛': 'dao', '完': 'wan', '全': 'quan',
  '龙': 'long', '忍': 'ren', '者': 'zhe', '神': 'shen', '龟': 'gui', '传': 'chuan',
  '成': 'cheng', '加': 'jia', '强': 'qiang', '激': 'ji', '海': 'hai', '盗': 'dao',
  '街': 'jie', '霸': 'ba', '王': 'wang', '超': 'chao', '级': 'ji', '马': 'ma', '里': 'li', '奥': 'ao',
  '踢': 'ti', '主': 'zhu', '角': 'jiao', '怒': 'nu', '洛': 'luo', '克': 'ke',
  '魂': 'hun', '斗': 'dou', '罗': 'luo', '代': 'dai', '散': 'san', '弹': 'dan', '枪': 'qiang',
  '隐': 'yin', '藏': 'cang', '子': 'zi', '星': 'xing', '际': 'ji', '增': 'zeng', '音': 'yin', '乐': 'le',
  '测': 'ce', '试': 'shi', '选': 'xuan', '关': 'guan', '世': 'shi', '嘉': 'jia', '体': 'ti', '力': 'li',
  '中': 'zhong', '文': 'wen', '减': 'jian', '剑': 'jian', '外': 'wai', '模': 'mo', '式': 'shi',
  '假': 'jia', '面': 'mian', '花': 'hua', '丸': 'wan', '释': 'shi', '放': 'fang', '术': 'shu', '消': 'xiao', '耗': 'hao',
  '空': 'kong', '百': 'bai', '弹': 'dan', '药': 'yao', '快': 'kuai', '速': 'su', '升': 'sheng', '套': 'tao', '道': 'dao', '具': 'ju',
  '魔': 'mo', '法': 'fa', '技': 'ji', '能': 'neng', '熊': 'xiong', '猫': 'mao',
  '马': 'ma', '博': 'bo', '赤': 'chi', '影': 'ying', '高': 'gao', '艳': 'yan',
  '功': 'gong', '夫': 'fu', '双': 'shuang', '截': 'jie', '复': 'fu', '仇': 'chou', '塔': 'ta', '石': 'shi',
  '背': 'bei', '叛': 'pan', '佛': 'fo', '易': 'yi', '组': 'zu', '吸': 'xi', '男': 'nan', '爵': 'jue',
  '靳': 'jin', '大': 'da', '治': 'zhi', '阿': 'a', '渊': 'yuan', '幻': 'huan', '想': 'xiang',
  '刀': 'dao', '魂': 'hun', '魄': 'po', '少': 'shao', '年': 'nian', '拳': 'quan', '皇': 'huang',
  '说': 'shuo', '使': 'shi', '徒': 'tu', '牙': 'ya', '章': 'zhang', '金': 'jin', '明': 'ming',
  '赛': 'sai', '车': 'che', '音': 'yin', '速': 'su', '机': 'ji', '械': 'xie', '坦': 'tan', '克': 'ke',
  '银': 'yin', '河': 'he', '号': 'hao', '宇': 'yu', '宙': 'zhou', '巡': 'xun', '航': 'hang',
  '赌': 'du', '沙': 'sha', '曼': 'man', '蛇': 'she', '极': 'ji', '上': 'shang', '后': 'hou', '原': 'yuan', '地': 'di',
  '复': 'fu', '活': 'huo', '保': 'bao', '留': 'liu', '武': 'wu', '器': 'qi', '随': 'sui', '附': 'fu',
  '护': 'hu', '盾': 'dun', '帝': 'di', '国': 'guo', '第': 'di', '二': 'er', '次': 'ci', '器': 'qi', '人': 'ren',
  '幅': 'fu', '唯': 'wei', '一': 'yi', '纳': 'na', '梦': 'meng', '幻': 'huan',
  ...extendedPinyinMap // 合并扩展映射
};

// 更智能的中文转拼音函数
function chineseToPinyinAdvanced(chinese) {
  return chinese.split('').map(char => {
    if (allPinyinMap[char]) {
      return allPinyinMap[char];
    }
    // 如果没有找到拼音，尝试保持原字符
    if (/[\u4e00-\u9fff]/.test(char)) {
      // 如果是中文字符但没有映射，使用简化规则
      const charCode = char.charCodeAt(0);
      return 'zh' + (charCode % 26).toString(36); // 生成一个基于字符编码的标识符
    }
    return char;
  }).join('');
}

// 从现有文件名推断新的文件名映射
function extractFileMapping() {
  console.log('📊 分析现有文件名模式...');
  
  const fcRomDir = 'public/roms/fc';
  const fcImageDir = 'public/roms/images/fc';
  
  const mapping = new Map();
  
  // 扫描ROM文件
  if (fs.existsSync(fcRomDir)) {
    const romFiles = fs.readdirSync(fcRomDir);
    romFiles.forEach(file => {
      if (file.endsWith('.nes') || file.endsWith('.NES')) {
        // 分析文件名，尝试还原原始中文名
        // 这里我们使用一个简化的映射策略
        mapping.set(file, file);
      }
    });
  }
  
  // 扫描截图文件
  if (fs.existsSync(fcImageDir)) {
    const imageFiles = fs.readdirSync(fcImageDir);
    imageFiles.forEach(file => {
      if (file.endsWith('.png') || file.endsWith('.PNG')) {
        mapping.set(file, file);
      }
    });
  }
  
  console.log(`发现 ${mapping.size} 个文件需要分析`);
  return mapping;
}

// 查找并修复JSON中剩余的中文路径
function fixRemainingChinesePaths() {
  console.log('🔧 修复剩余的中文路径引用...');
  
  const fcJsonDir = 'public/data/games/fc';
  const jsonFiles = fs.readdirSync(fcJsonDir).filter(f => f.endsWith('.json'));
  
  let totalFixed = 0;
  
  for (const jsonFile of jsonFiles) {
    const jsonPath = path.join(fcJsonDir, jsonFile);
    console.log(`处理文件: ${jsonFile}`);
    
    try {
      const content = fs.readFileSync(jsonPath, 'utf8');
      const games = JSON.parse(content);
      
      let fileFixed = 0;
      
      games.forEach((game, index) => {
        let modified = false;
        
        // 检查并修复romPath
        if (game.romPath && /[\u4e00-\u9fff]/.test(game.romPath)) {
          const filename = path.basename(game.romPath);
          const newFilename = sanitizeFileName(filename);
          game.romPath = game.romPath.replace(filename, newFilename);
          modified = true;
        }
        
        // 检查并修复cover路径
        if (game.cover && /[\u4e00-\u9fff]/.test(game.cover)) {
          const filename = path.basename(game.cover);
          const newFilename = sanitizeFileName(filename);
          game.cover = game.cover.replace(filename, newFilename);
          modified = true;
        }
        
        // 检查并修复ID中的中文
        if (game.id && /[\u4e00-\u9fff]/.test(game.id)) {
          game.id = sanitizeFileName(game.id);
          modified = true;
        }
        
        if (modified) {
          fileFixed++;
        }
      });
      
      if (fileFixed > 0) {
        fs.writeFileSync(jsonPath, JSON.stringify(games, null, 2), 'utf8');
        console.log(`  ✅ 修复了 ${fileFixed} 个游戏的路径引用`);
        totalFixed += fileFixed;
      } else {
        console.log(`  ℹ️  无需修复`);
      }
      
    } catch (error) {
      console.error(`  ❌ 处理失败: ${error.message}`);
    }
  }
  
  console.log(`\n📊 总共修复了 ${totalFixed} 个路径引用`);
  return totalFixed;
}

// 文件名安全化处理（使用更好的拼音转换）
function sanitizeFileName(filename) {
  const ext = path.extname(filename);
  const nameWithoutExt = path.basename(filename, ext);
  
  return nameWithoutExt
    // 使用改进的中文转拼音
    .replace(/[\u4e00-\u9fff]/g, char => allPinyinMap[char] || chineseToPinyinAdvanced(char))
    // 替换特殊字符为连字符
    .replace(/[\s\(\)\[\]（）【】\+\-\=\_\.\,\!\@\#\$\%\^\&\*\~\`\;\:\'\"\?\/\\\|\<\>]/g, '-')
    // 移除连续的连字符
    .replace(/-+/g, '-')
    // 移除开头和结尾的连字符
    .replace(/^-+|-+$/g, '')
    // 转为小写
    .toLowerCase() + ext;
}

// 验证修复结果
function verifyFix() {
  console.log('🔍 验证修复结果...');
  
  const fcJsonDir = 'public/data/games/fc';
  const jsonFiles = fs.readdirSync(fcJsonDir).filter(f => f.endsWith('.json'));
  
  let remainingChinesePaths = 0;
  
  for (const jsonFile of jsonFiles) {
    const jsonPath = path.join(fcJsonDir, jsonFile);
    const content = fs.readFileSync(jsonPath, 'utf8');
    
    // 检查romPath和cover字段中的中文
    const pathMatches = content.match(/"(?:romPath|cover)"\s*:\s*"[^"]*[\u4e00-\u9fff][^"]*"/g);
    if (pathMatches) {
      console.log(`⚠️  ${jsonFile} 仍包含 ${pathMatches.length} 个中文路径`);
      remainingChinesePaths += pathMatches.length;
      
      // 显示前几个示例
      pathMatches.slice(0, 3).forEach(match => {
        console.log(`  示例: ${match}`);
      });
    }
  }
  
  if (remainingChinesePaths === 0) {
    console.log('✅ 所有中文路径已成功修复');
  } else {
    console.log(`⚠️  仍有 ${remainingChinesePaths} 个中文路径需要处理`);
  }
  
  return remainingChinesePaths;
}

// 主函数
function main() {
  console.log('🔧 开始修复剩余的中文路径引用...\n');
  
  try {
    // 1. 修复JSON文件中的中文路径
    const fixedCount = fixRemainingChinesePaths();
    
    // 2. 验证修复结果
    const remainingCount = verifyFix();
    
    if (remainingCount === 0) {
      console.log('\n🎉 所有中文路径引用修复完成！');
    } else {
      console.log(`\n⚠️  还有 ${remainingCount} 个路径需要手动处理`);
    }
    
  } catch (error) {
    console.error('❌ 修复过程中发生错误:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  fixRemainingChinesePaths,
  verifyFix,
  main
};