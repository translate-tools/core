export type ISO639LangCode = {
	v1: string | null;
	v2: string;
	v2B?: string;
	v2T?: string;
};

// Codes from https://www.loc.gov/standards/iso639-2/php/code_list.php
const languages: ISO639LangCode[] = [
	{
		v1: 'aa',
		v2: 'aar',
	},
	{
		v1: 'ab',
		v2: 'abk',
	},
	{
		v1: null,
		v2: 'ace',
	},
	{
		v1: null,
		v2: 'ach',
	},
	{
		v1: null,
		v2: 'ada',
	},
	{
		v1: null,
		v2: 'ady',
	},
	{
		v1: null,
		v2: 'afa',
	},
	{
		v1: null,
		v2: 'afh',
	},
	{
		v1: 'af',
		v2: 'afr',
	},
	{
		v1: null,
		v2: 'ain',
	},
	{
		v1: 'ak',
		v2: 'aka',
	},
	{
		v1: null,
		v2: 'akk',
	},
	{
		v1: 'sq',
		v2: 'alb',
		v2B: 'alb',
		v2T: 'sqi',
	},
	{
		v1: null,
		v2: 'ale',
	},
	{
		v1: null,
		v2: 'alg',
	},
	{
		v1: null,
		v2: 'alt',
	},
	{
		v1: 'am',
		v2: 'amh',
	},
	{
		v1: null,
		v2: 'ang',
	},
	{
		v1: null,
		v2: 'anp',
	},
	{
		v1: null,
		v2: 'apa',
	},
	{
		v1: 'ar',
		v2: 'ara',
	},
	{
		v1: null,
		v2: 'arc',
	},
	{
		v1: 'an',
		v2: 'arg',
	},
	{
		v1: 'hy',
		v2: 'arm',
		v2B: 'arm',
		v2T: 'hye',
	},
	{
		v1: null,
		v2: 'arn',
	},
	{
		v1: null,
		v2: 'arp',
	},
	{
		v1: null,
		v2: 'art',
	},
	{
		v1: null,
		v2: 'arw',
	},
	{
		v1: 'as',
		v2: 'asm',
	},
	{
		v1: null,
		v2: 'ast',
	},
	{
		v1: null,
		v2: 'ath',
	},
	{
		v1: null,
		v2: 'aus',
	},
	{
		v1: 'av',
		v2: 'ava',
	},
	{
		v1: 'ae',
		v2: 'ave',
	},
	{
		v1: null,
		v2: 'awa',
	},
	{
		v1: 'ay',
		v2: 'aym',
	},
	{
		v1: 'az',
		v2: 'aze',
	},
	{
		v1: null,
		v2: 'bad',
	},
	{
		v1: null,
		v2: 'bai',
	},
	{
		v1: 'ba',
		v2: 'bak',
	},
	{
		v1: null,
		v2: 'bal',
	},
	{
		v1: 'bm',
		v2: 'bam',
	},
	{
		v1: null,
		v2: 'ban',
	},
	{
		v1: 'eu',
		v2: 'baq',
		v2B: 'baq',
		v2T: 'eus',
	},
	{
		v1: null,
		v2: 'bas',
	},
	{
		v1: null,
		v2: 'bat',
	},
	{
		v1: null,
		v2: 'bej',
	},
	{
		v1: 'be',
		v2: 'bel',
	},
	{
		v1: null,
		v2: 'bem',
	},
	{
		v1: 'bn',
		v2: 'ben',
	},
	{
		v1: null,
		v2: 'ber',
	},
	{
		v1: null,
		v2: 'bho',
	},
	{
		v1: 'bh',
		v2: 'bih',
	},
	{
		v1: null,
		v2: 'bik',
	},
	{
		v1: null,
		v2: 'bin',
	},
	{
		v1: 'bi',
		v2: 'bis',
	},
	{
		v1: null,
		v2: 'bla',
	},
	{
		v1: null,
		v2: 'bnt',
	},
	{
		v1: 'bo',
		v2: 'tib',
		v2B: 'tib',
		v2T: 'bod',
	},
	{
		v1: 'bs',
		v2: 'bos',
	},
	{
		v1: null,
		v2: 'bra',
	},
	{
		v1: 'br',
		v2: 'bre',
	},
	{
		v1: null,
		v2: 'btk',
	},
	{
		v1: null,
		v2: 'bua',
	},
	{
		v1: null,
		v2: 'bug',
	},
	{
		v1: 'bg',
		v2: 'bul',
	},
	{
		v1: 'my',
		v2: 'bur',
		v2B: 'bur',
		v2T: 'mya',
	},
	{
		v1: null,
		v2: 'byn',
	},
	{
		v1: null,
		v2: 'cad',
	},
	{
		v1: null,
		v2: 'cai',
	},
	{
		v1: null,
		v2: 'car',
	},
	{
		v1: 'ca',
		v2: 'cat',
	},
	{
		v1: null,
		v2: 'cau',
	},
	{
		v1: null,
		v2: 'ceb',
	},
	{
		v1: null,
		v2: 'cel',
	},
	{
		v1: 'cs',
		v2: 'cze',
		v2B: 'cze',
		v2T: 'ces',
	},
	{
		v1: 'ch',
		v2: 'cha',
	},
	{
		v1: null,
		v2: 'chb',
	},
	{
		v1: 'ce',
		v2: 'che',
	},
	{
		v1: null,
		v2: 'chg',
	},
	{
		v1: 'zh',
		v2: 'chi',
		v2B: 'chi',
		v2T: 'zho',
	},
	{
		v1: null,
		v2: 'chk',
	},
	{
		v1: null,
		v2: 'chm',
	},
	{
		v1: null,
		v2: 'chn',
	},
	{
		v1: null,
		v2: 'cho',
	},
	{
		v1: null,
		v2: 'chp',
	},
	{
		v1: null,
		v2: 'chr',
	},
	{
		v1: 'cu',
		v2: 'chu',
	},
	{
		v1: 'cv',
		v2: 'chv',
	},
	{
		v1: null,
		v2: 'chy',
	},
	{
		v1: null,
		v2: 'cmc',
	},
	{
		v1: null,
		v2: 'cnr',
	},
	{
		v1: null,
		v2: 'cop',
	},
	{
		v1: 'kw',
		v2: 'cor',
	},
	{
		v1: 'co',
		v2: 'cos',
	},
	{
		v1: null,
		v2: 'cpe',
	},
	{
		v1: null,
		v2: 'cpf',
	},
	{
		v1: null,
		v2: 'cpp',
	},
	{
		v1: 'cr',
		v2: 'cre',
	},
	{
		v1: null,
		v2: 'crh',
	},
	{
		v1: null,
		v2: 'crp',
	},
	{
		v1: null,
		v2: 'csb',
	},
	{
		v1: null,
		v2: 'cus',
	},
	{
		v1: 'cy',
		v2: 'wel',
		v2B: 'wel',
		v2T: 'cym',
	},
	{
		v1: null,
		v2: 'dak',
	},
	{
		v1: 'da',
		v2: 'dan',
	},
	{
		v1: null,
		v2: 'dar',
	},
	{
		v1: null,
		v2: 'day',
	},
	{
		v1: null,
		v2: 'del',
	},
	{
		v1: null,
		v2: 'den',
	},
	{
		v1: 'de',
		v2: 'ger',
		v2B: 'ger',
		v2T: 'deu',
	},
	{
		v1: null,
		v2: 'dgr',
	},
	{
		v1: null,
		v2: 'din',
	},
	{
		v1: 'dv',
		v2: 'div',
	},
	{
		v1: null,
		v2: 'doi',
	},
	{
		v1: null,
		v2: 'dra',
	},
	{
		v1: null,
		v2: 'dsb',
	},
	{
		v1: null,
		v2: 'dua',
	},
	{
		v1: null,
		v2: 'dum',
	},
	{
		v1: 'nl',
		v2: 'dut',
		v2B: 'dut',
		v2T: 'nld',
	},
	{
		v1: null,
		v2: 'dyu',
	},
	{
		v1: 'dz',
		v2: 'dzo',
	},
	{
		v1: null,
		v2: 'efi',
	},
	{
		v1: null,
		v2: 'egy',
	},
	{
		v1: null,
		v2: 'eka',
	},
	{
		v1: 'el',
		v2: 'gre',
		v2B: 'gre',
		v2T: 'ell',
	},
	{
		v1: null,
		v2: 'elx',
	},
	{
		v1: 'en',
		v2: 'eng',
	},
	{
		v1: null,
		v2: 'enm',
	},
	{
		v1: 'eo',
		v2: 'epo',
	},
	{
		v1: 'et',
		v2: 'est',
	},
	{
		v1: 'ee',
		v2: 'ewe',
	},
	{
		v1: null,
		v2: 'ewo',
	},
	{
		v1: null,
		v2: 'fan',
	},
	{
		v1: 'fo',
		v2: 'fao',
	},
	{
		v1: 'fa',
		v2: 'per',
		v2B: 'per',
		v2T: 'fas',
	},
	{
		v1: null,
		v2: 'fat',
	},
	{
		v1: 'fj',
		v2: 'fij',
	},
	{
		v1: null,
		v2: 'fil',
	},
	{
		v1: 'fi',
		v2: 'fin',
	},
	{
		v1: null,
		v2: 'fiu',
	},
	{
		v1: null,
		v2: 'fon',
	},
	{
		v1: 'fr',
		v2: 'fre',
		v2B: 'fre',
		v2T: 'fra',
	},
	{
		v1: null,
		v2: 'frm',
	},
	{
		v1: null,
		v2: 'fro',
	},
	{
		v1: null,
		v2: 'frr',
	},
	{
		v1: null,
		v2: 'frs',
	},
	{
		v1: 'fy',
		v2: 'fry',
	},
	{
		v1: 'ff',
		v2: 'ful',
	},
	{
		v1: null,
		v2: 'fur',
	},
	{
		v1: null,
		v2: 'gaa',
	},
	{
		v1: null,
		v2: 'gay',
	},
	{
		v1: null,
		v2: 'gba',
	},
	{
		v1: null,
		v2: 'gem',
	},
	{
		v1: 'ka',
		v2: 'geo',
		v2B: 'geo',
		v2T: 'kat',
	},
	{
		v1: null,
		v2: 'gez',
	},
	{
		v1: null,
		v2: 'gil',
	},
	{
		v1: 'gd',
		v2: 'gla',
	},
	{
		v1: 'ga',
		v2: 'gle',
	},
	{
		v1: 'gl',
		v2: 'glg',
	},
	{
		v1: 'gv',
		v2: 'glv',
	},
	{
		v1: null,
		v2: 'gmh',
	},
	{
		v1: null,
		v2: 'goh',
	},
	{
		v1: null,
		v2: 'gon',
	},
	{
		v1: null,
		v2: 'gor',
	},
	{
		v1: null,
		v2: 'got',
	},
	{
		v1: null,
		v2: 'grb',
	},
	{
		v1: null,
		v2: 'grc',
	},
	{
		v1: 'gn',
		v2: 'grn',
	},
	{
		v1: null,
		v2: 'gsw',
	},
	{
		v1: 'gu',
		v2: 'guj',
	},
	{
		v1: null,
		v2: 'gwi',
	},
	{
		v1: null,
		v2: 'hai',
	},
	{
		v1: 'ht',
		v2: 'hat',
	},
	{
		v1: 'ha',
		v2: 'hau',
	},
	{
		v1: null,
		v2: 'haw',
	},
	{
		v1: 'he',
		v2: 'heb',
	},
	{
		v1: 'hz',
		v2: 'her',
	},
	{
		v1: null,
		v2: 'hil',
	},
	{
		v1: null,
		v2: 'him',
	},
	{
		v1: 'hi',
		v2: 'hin',
	},
	{
		v1: null,
		v2: 'hit',
	},
	{
		v1: null,
		v2: 'hmn',
	},
	{
		v1: 'ho',
		v2: 'hmo',
	},
	{
		v1: 'hr',
		v2: 'hrv',
	},
	{
		v1: null,
		v2: 'hsb',
	},
	{
		v1: 'hu',
		v2: 'hun',
	},
	{
		v1: null,
		v2: 'hup',
	},
	{
		v1: null,
		v2: 'iba',
	},
	{
		v1: 'ig',
		v2: 'ibo',
	},
	{
		v1: 'is',
		v2: 'ice',
		v2B: 'ice',
		v2T: 'isl',
	},
	{
		v1: 'io',
		v2: 'ido',
	},
	{
		v1: 'ii',
		v2: 'iii',
	},
	{
		v1: null,
		v2: 'ijo',
	},
	{
		v1: 'iu',
		v2: 'iku',
	},
	{
		v1: 'ie',
		v2: 'ile',
	},
	{
		v1: null,
		v2: 'ilo',
	},
	{
		v1: 'ia',
		v2: 'ina',
	},
	{
		v1: null,
		v2: 'inc',
	},
	{
		v1: 'id',
		v2: 'ind',
	},
	{
		v1: null,
		v2: 'ine',
	},
	{
		v1: null,
		v2: 'inh',
	},
	{
		v1: 'ik',
		v2: 'ipk',
	},
	{
		v1: null,
		v2: 'ira',
	},
	{
		v1: null,
		v2: 'iro',
	},
	{
		v1: 'it',
		v2: 'ita',
	},
	{
		v1: 'jv',
		v2: 'jav',
	},
	{
		v1: null,
		v2: 'jbo',
	},
	{
		v1: 'ja',
		v2: 'jpn',
	},
	{
		v1: null,
		v2: 'jpr',
	},
	{
		v1: null,
		v2: 'jrb',
	},
	{
		v1: null,
		v2: 'kaa',
	},
	{
		v1: null,
		v2: 'kab',
	},
	{
		v1: null,
		v2: 'kac',
	},
	{
		v1: 'kl',
		v2: 'kal',
	},
	{
		v1: null,
		v2: 'kam',
	},
	{
		v1: 'kn',
		v2: 'kan',
	},
	{
		v1: null,
		v2: 'kar',
	},
	{
		v1: 'ks',
		v2: 'kas',
	},
	{
		v1: 'kr',
		v2: 'kau',
	},
	{
		v1: null,
		v2: 'kaw',
	},
	{
		v1: 'kk',
		v2: 'kaz',
	},
	{
		v1: null,
		v2: 'kbd',
	},
	{
		v1: null,
		v2: 'kha',
	},
	{
		v1: null,
		v2: 'khi',
	},
	{
		v1: 'km',
		v2: 'khm',
	},
	{
		v1: null,
		v2: 'kho',
	},
	{
		v1: 'ki',
		v2: 'kik',
	},
	{
		v1: 'rw',
		v2: 'kin',
	},
	{
		v1: 'ky',
		v2: 'kir',
	},
	{
		v1: null,
		v2: 'kmb',
	},
	{
		v1: null,
		v2: 'kok',
	},
	{
		v1: 'kv',
		v2: 'kom',
	},
	{
		v1: 'kg',
		v2: 'kon',
	},
	{
		v1: 'ko',
		v2: 'kor',
	},
	{
		v1: null,
		v2: 'kos',
	},
	{
		v1: null,
		v2: 'kpe',
	},
	{
		v1: null,
		v2: 'krc',
	},
	{
		v1: null,
		v2: 'krl',
	},
	{
		v1: null,
		v2: 'kro',
	},
	{
		v1: null,
		v2: 'kru',
	},
	{
		v1: 'kj',
		v2: 'kua',
	},
	{
		v1: null,
		v2: 'kum',
	},
	{
		v1: 'ku',
		v2: 'kur',
	},
	{
		v1: null,
		v2: 'kut',
	},
	{
		v1: null,
		v2: 'lad',
	},
	{
		v1: null,
		v2: 'lah',
	},
	{
		v1: null,
		v2: 'lam',
	},
	{
		v1: 'lo',
		v2: 'lao',
	},
	{
		v1: 'la',
		v2: 'lat',
	},
	{
		v1: 'lv',
		v2: 'lav',
	},
	{
		v1: null,
		v2: 'lez',
	},
	{
		v1: 'li',
		v2: 'lim',
	},
	{
		v1: 'ln',
		v2: 'lin',
	},
	{
		v1: 'lt',
		v2: 'lit',
	},
	{
		v1: null,
		v2: 'lol',
	},
	{
		v1: null,
		v2: 'loz',
	},
	{
		v1: 'lb',
		v2: 'ltz',
	},
	{
		v1: null,
		v2: 'lua',
	},
	{
		v1: 'lu',
		v2: 'lub',
	},
	{
		v1: 'lg',
		v2: 'lug',
	},
	{
		v1: null,
		v2: 'lui',
	},
	{
		v1: null,
		v2: 'lun',
	},
	{
		v1: null,
		v2: 'luo',
	},
	{
		v1: null,
		v2: 'lus',
	},
	{
		v1: 'mk',
		v2: 'mac',
		v2B: 'mac',
		v2T: 'mkd',
	},
	{
		v1: null,
		v2: 'mad',
	},
	{
		v1: null,
		v2: 'mag',
	},
	{
		v1: 'mh',
		v2: 'mah',
	},
	{
		v1: null,
		v2: 'mai',
	},
	{
		v1: null,
		v2: 'mak',
	},
	{
		v1: 'ml',
		v2: 'mal',
	},
	{
		v1: null,
		v2: 'man',
	},
	{
		v1: 'mi',
		v2: 'mao',
		v2B: 'mao',
		v2T: 'mri',
	},
	{
		v1: null,
		v2: 'map',
	},
	{
		v1: 'mr',
		v2: 'mar',
	},
	{
		v1: null,
		v2: 'mas',
	},
	{
		v1: 'ms',
		v2: 'may',
		v2B: 'may',
		v2T: 'msa',
	},
	{
		v1: null,
		v2: 'mdf',
	},
	{
		v1: null,
		v2: 'mdr',
	},
	{
		v1: null,
		v2: 'men',
	},
	{
		v1: null,
		v2: 'mga',
	},
	{
		v1: null,
		v2: 'mic',
	},
	{
		v1: null,
		v2: 'min',
	},
	{
		v1: null,
		v2: 'mis',
	},
	{
		v1: null,
		v2: 'mkh',
	},
	{
		v1: 'mg',
		v2: 'mlg',
	},
	{
		v1: 'mt',
		v2: 'mlt',
	},
	{
		v1: null,
		v2: 'mnc',
	},
	{
		v1: null,
		v2: 'mni',
	},
	{
		v1: null,
		v2: 'mno',
	},
	{
		v1: null,
		v2: 'moh',
	},
	{
		v1: 'mn',
		v2: 'mon',
	},
	{
		v1: null,
		v2: 'mos',
	},
	{
		v1: null,
		v2: 'mul',
	},
	{
		v1: null,
		v2: 'mun',
	},
	{
		v1: null,
		v2: 'mus',
	},
	{
		v1: null,
		v2: 'mwl',
	},
	{
		v1: null,
		v2: 'mwr',
	},
	{
		v1: null,
		v2: 'myn',
	},
	{
		v1: null,
		v2: 'myv',
	},
	{
		v1: null,
		v2: 'nah',
	},
	{
		v1: null,
		v2: 'nai',
	},
	{
		v1: null,
		v2: 'nap',
	},
	{
		v1: 'na',
		v2: 'nau',
	},
	{
		v1: 'nv',
		v2: 'nav',
	},
	{
		v1: 'nr',
		v2: 'nbl',
	},
	{
		v1: 'nd',
		v2: 'nde',
	},
	{
		v1: 'ng',
		v2: 'ndo',
	},
	{
		v1: null,
		v2: 'nds',
	},
	{
		v1: 'ne',
		v2: 'nep',
	},
	{
		v1: null,
		v2: 'new',
	},
	{
		v1: null,
		v2: 'nia',
	},
	{
		v1: null,
		v2: 'nic',
	},
	{
		v1: null,
		v2: 'niu',
	},
	{
		v1: 'nn',
		v2: 'nno',
	},
	{
		v1: 'nb',
		v2: 'nob',
	},
	{
		v1: null,
		v2: 'nog',
	},
	{
		v1: null,
		v2: 'non',
	},
	{
		v1: 'no',
		v2: 'nor',
	},
	{
		v1: null,
		v2: 'nqo',
	},
	{
		v1: null,
		v2: 'nso',
	},
	{
		v1: null,
		v2: 'nub',
	},
	{
		v1: null,
		v2: 'nwc',
	},
	{
		v1: 'ny',
		v2: 'nya',
	},
	{
		v1: null,
		v2: 'nym',
	},
	{
		v1: null,
		v2: 'nyn',
	},
	{
		v1: null,
		v2: 'nyo',
	},
	{
		v1: null,
		v2: 'nzi',
	},
	{
		v1: 'oc',
		v2: 'oci',
	},
	{
		v1: 'oj',
		v2: 'oji',
	},
	{
		v1: 'or',
		v2: 'ori',
	},
	{
		v1: 'om',
		v2: 'orm',
	},
	{
		v1: null,
		v2: 'osa',
	},
	{
		v1: 'os',
		v2: 'oss',
	},
	{
		v1: null,
		v2: 'ota',
	},
	{
		v1: null,
		v2: 'oto',
	},
	{
		v1: null,
		v2: 'paa',
	},
	{
		v1: null,
		v2: 'pag',
	},
	{
		v1: null,
		v2: 'pal',
	},
	{
		v1: null,
		v2: 'pam',
	},
	{
		v1: 'pa',
		v2: 'pan',
	},
	{
		v1: null,
		v2: 'pap',
	},
	{
		v1: null,
		v2: 'pau',
	},
	{
		v1: null,
		v2: 'peo',
	},
	{
		v1: null,
		v2: 'phi',
	},
	{
		v1: null,
		v2: 'phn',
	},
	{
		v1: 'pi',
		v2: 'pli',
	},
	{
		v1: 'pl',
		v2: 'pol',
	},
	{
		v1: null,
		v2: 'pon',
	},
	{
		v1: 'pt',
		v2: 'por',
	},
	{
		v1: null,
		v2: 'pra',
	},
	{
		v1: null,
		v2: 'pro',
	},
	{
		v1: 'ps',
		v2: 'pus',
	},
	{
		v1: null,
		v2: 'qaa-qtz',
	},
	{
		v1: 'qu',
		v2: 'que',
	},
	{
		v1: null,
		v2: 'raj',
	},
	{
		v1: null,
		v2: 'rap',
	},
	{
		v1: null,
		v2: 'rar',
	},
	{
		v1: null,
		v2: 'roa',
	},
	{
		v1: 'rm',
		v2: 'roh',
	},
	{
		v1: null,
		v2: 'rom',
	},
	{
		v1: 'ro',
		v2: 'rum',
		v2B: 'rum',
		v2T: 'ron',
	},
	{
		v1: 'rn',
		v2: 'run',
	},
	{
		v1: null,
		v2: 'rup',
	},
	{
		v1: 'ru',
		v2: 'rus',
	},
	{
		v1: null,
		v2: 'sad',
	},
	{
		v1: 'sg',
		v2: 'sag',
	},
	{
		v1: null,
		v2: 'sah',
	},
	{
		v1: null,
		v2: 'sai',
	},
	{
		v1: null,
		v2: 'sal',
	},
	{
		v1: null,
		v2: 'sam',
	},
	{
		v1: 'sa',
		v2: 'san',
	},
	{
		v1: null,
		v2: 'sas',
	},
	{
		v1: null,
		v2: 'sat',
	},
	{
		v1: null,
		v2: 'scn',
	},
	{
		v1: null,
		v2: 'sco',
	},
	{
		v1: null,
		v2: 'sel',
	},
	{
		v1: null,
		v2: 'sem',
	},
	{
		v1: null,
		v2: 'sga',
	},
	{
		v1: null,
		v2: 'sgn',
	},
	{
		v1: null,
		v2: 'shn',
	},
	{
		v1: null,
		v2: 'sid',
	},
	{
		v1: 'si',
		v2: 'sin',
	},
	{
		v1: null,
		v2: 'sio',
	},
	{
		v1: null,
		v2: 'sit',
	},
	{
		v1: null,
		v2: 'sla',
	},
	{
		v1: 'sk',
		v2: 'slo',
		v2B: 'slo',
		v2T: 'slk',
	},
	{
		v1: 'sl',
		v2: 'slv',
	},
	{
		v1: null,
		v2: 'sma',
	},
	{
		v1: 'se',
		v2: 'sme',
	},
	{
		v1: null,
		v2: 'smi',
	},
	{
		v1: null,
		v2: 'smj',
	},
	{
		v1: null,
		v2: 'smn',
	},
	{
		v1: 'sm',
		v2: 'smo',
	},
	{
		v1: null,
		v2: 'sms',
	},
	{
		v1: 'sn',
		v2: 'sna',
	},
	{
		v1: 'sd',
		v2: 'snd',
	},
	{
		v1: null,
		v2: 'snk',
	},
	{
		v1: null,
		v2: 'sog',
	},
	{
		v1: 'so',
		v2: 'som',
	},
	{
		v1: null,
		v2: 'son',
	},
	{
		v1: 'st',
		v2: 'sot',
	},
	{
		v1: 'es',
		v2: 'spa',
	},
	{
		v1: 'sc',
		v2: 'srd',
	},
	{
		v1: null,
		v2: 'srn',
	},
	{
		v1: 'sr',
		v2: 'srp',
	},
	{
		v1: null,
		v2: 'srr',
	},
	{
		v1: null,
		v2: 'ssa',
	},
	{
		v1: 'ss',
		v2: 'ssw',
	},
	{
		v1: null,
		v2: 'suk',
	},
	{
		v1: 'su',
		v2: 'sun',
	},
	{
		v1: null,
		v2: 'sus',
	},
	{
		v1: null,
		v2: 'sux',
	},
	{
		v1: 'sw',
		v2: 'swa',
	},
	{
		v1: 'sv',
		v2: 'swe',
	},
	{
		v1: null,
		v2: 'syc',
	},
	{
		v1: null,
		v2: 'syr',
	},
	{
		v1: 'ty',
		v2: 'tah',
	},
	{
		v1: null,
		v2: 'tai',
	},
	{
		v1: 'ta',
		v2: 'tam',
	},
	{
		v1: 'tt',
		v2: 'tat',
	},
	{
		v1: 'te',
		v2: 'tel',
	},
	{
		v1: null,
		v2: 'tem',
	},
	{
		v1: null,
		v2: 'ter',
	},
	{
		v1: null,
		v2: 'tet',
	},
	{
		v1: 'tg',
		v2: 'tgk',
	},
	{
		v1: 'tl',
		v2: 'tgl',
	},
	{
		v1: 'th',
		v2: 'tha',
	},
	{
		v1: null,
		v2: 'tig',
	},
	{
		v1: 'ti',
		v2: 'tir',
	},
	{
		v1: null,
		v2: 'tiv',
	},
	{
		v1: null,
		v2: 'tkl',
	},
	{
		v1: null,
		v2: 'tlh',
	},
	{
		v1: null,
		v2: 'tli',
	},
	{
		v1: null,
		v2: 'tmh',
	},
	{
		v1: null,
		v2: 'tog',
	},
	{
		v1: 'to',
		v2: 'ton',
	},
	{
		v1: null,
		v2: 'tpi',
	},
	{
		v1: null,
		v2: 'tsi',
	},
	{
		v1: 'tn',
		v2: 'tsn',
	},
	{
		v1: 'ts',
		v2: 'tso',
	},
	{
		v1: 'tk',
		v2: 'tuk',
	},
	{
		v1: null,
		v2: 'tum',
	},
	{
		v1: null,
		v2: 'tup',
	},
	{
		v1: 'tr',
		v2: 'tur',
	},
	{
		v1: null,
		v2: 'tut',
	},
	{
		v1: null,
		v2: 'tvl',
	},
	{
		v1: 'tw',
		v2: 'twi',
	},
	{
		v1: null,
		v2: 'tyv',
	},
	{
		v1: null,
		v2: 'udm',
	},
	{
		v1: null,
		v2: 'uga',
	},
	{
		v1: 'ug',
		v2: 'uig',
	},
	{
		v1: 'uk',
		v2: 'ukr',
	},
	{
		v1: null,
		v2: 'umb',
	},
	{
		v1: null,
		v2: 'und',
	},
	{
		v1: 'ur',
		v2: 'urd',
	},
	{
		v1: 'uz',
		v2: 'uzb',
	},
	{
		v1: null,
		v2: 'vai',
	},
	{
		v1: 've',
		v2: 'ven',
	},
	{
		v1: 'vi',
		v2: 'vie',
	},
	{
		v1: 'vo',
		v2: 'vol',
	},
	{
		v1: null,
		v2: 'vot',
	},
	{
		v1: null,
		v2: 'wak',
	},
	{
		v1: null,
		v2: 'wal',
	},
	{
		v1: null,
		v2: 'war',
	},
	{
		v1: null,
		v2: 'was',
	},
	{
		v1: null,
		v2: 'wen',
	},
	{
		v1: 'wa',
		v2: 'wln',
	},
	{
		v1: 'wo',
		v2: 'wol',
	},
	{
		v1: null,
		v2: 'xal',
	},
	{
		v1: 'xh',
		v2: 'xho',
	},
	{
		v1: null,
		v2: 'yao',
	},
	{
		v1: null,
		v2: 'yap',
	},
	{
		v1: 'yi',
		v2: 'yid',
	},
	{
		v1: 'yo',
		v2: 'yor',
	},
	{
		v1: null,
		v2: 'ypk',
	},
	{
		v1: null,
		v2: 'zap',
	},
	{
		v1: null,
		v2: 'zbl',
	},
	{
		v1: null,
		v2: 'zen',
	},
	{
		v1: null,
		v2: 'zgh',
	},
	{
		v1: 'za',
		v2: 'zha',
	},
	{
		v1: null,
		v2: 'znd',
	},
	{
		v1: 'zu',
		v2: 'zul',
	},
	{
		v1: null,
		v2: 'zun',
	},
	{
		v1: null,
		v2: 'zxx',
	},
	{
		v1: null,
		v2: 'zza',
	},
];

export default languages;
