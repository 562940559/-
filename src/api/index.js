/**
  * api接口的统一出口
  */

import base from '@/api/base';
import login from '@/api/login';
import homepage from '@/api/homepage';
import fillingProgress from '@/api/fillingProgress';

export default {
  base,
  login,
  homepage,
  fillingProgress
}