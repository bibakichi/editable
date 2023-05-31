//#########################################################################################
const plugins = {};
const settings = [];
const urls = [];
const newImages = [];

var isEditMode = false; // 編集中か否か。編集中はモーダルのアニメーションを表示しない

const isDebugTree = false;
const isDebugPlugin = false;

let microsoftProfile = null;
let isLoginRequired = false;