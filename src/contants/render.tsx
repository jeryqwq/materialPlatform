import VuePreview from '@/components/FilePreviews/vue';
import TsPreview from '@/components/FilePreviews/ts';
import StylusPreview from '@/components/FilePreviews/stylus';
import JsPreview from '@/components/FilePreviews/js';
import ScssPreview from '@/components/FilePreviews/scss';
import ImgPreview from '@/components/FilePreviews/img';
import CssPreview from '@/components/FilePreviews/css';
import PdfPreview from '@/components/FilePreviews/pdf';
import JsonPreview from '@/components/FilePreviews/json';
import Mp4Preview from '@/components/FilePreviews/mp4';
export const VIS_STYLE_CLASSNAME = 'vis-style-class-name';
export const VIS_LIB_SCRIPT_CLASSNAME = 'vis-lib-script-class-name';
export const RENDER_PREVIEW_TOOL = 'RENDER_PREVIEW_TOOL';
export const CONSOLE_TYPES = {
  ERROR: Symbol(),
  WARN: Symbol(),
  USER: Symbol(),
};
// 需要缓存用户代码编辑记录，不能使用懒加载和自动注册, () => {} functional return obj !== obj , vue data () {  return {} } 同理
export const CACHE_COMP_LOADED: Record<
  string,
  (props: {
    file: FileDescription;
    onChange: Function;
    theme: 'light' | 'dark' | 'realdark';
  }) => JSX.Element
> = {
  vue: VuePreview,
  ts: TsPreview,
  stylus: StylusPreview,
  js: JsPreview,
  scss: ScssPreview,
  img: ImgPreview,
  css: CssPreview,
  pdf: PdfPreview,
  mp4: Mp4Preview,
  json: JsonPreview,
  mov: Mp4Preview,
};
