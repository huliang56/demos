const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const dir = path.join(__dirname, 'content/');
const fileDir = path.join(__dirname, 'content_compressed/');

const sectionKey = 'h3_title';

fs.readdir(dir, (err, files) => {
  if (!files.length) {
    console.warn('没有文件！');
    return false;
  }

  let book = {
    name: '电子技术基础',
    isbn: 'dzjsjcV3',
    chapters: []
  };

  generateBookMenu(book, files);

  generateBookContent(book, files);
});


// 生成书本章节
function generateBookMenu(book, files) {
  let chaptersObj = {};
  let errorArr = [];

  // 遍历文件，生成章节结构
  files.forEach((file) => {
    // 章序号
    let fileName = file.split('.');
    let chapterNum = Number(fileName[0]);
    let extName = fileName[fileName.length - 1];

    // 过滤非html后缀的文件
    if (extName !== 'html') {
      errorArr.push(file);
      return true;
    }

    // 若为新的一章，则创建
    if (!_.has(chaptersObj, chapterNum)) {
      book.chapters[chapterNum - 1] = {
        name: '第' + chapterNum + '章',
        sections: []
      };
      chaptersObj[chapterNum] = [];
    }

    let bookChapter = book.chapters[chapterNum - 1];
    let chapterObjLength = chaptersObj[chapterNum].length;
    let content = fs.readFileSync(dir + file, 'utf-8') + '\n\n';

    // 若是一个新的节，保留记录
    if (content.indexOf(sectionKey) !== -1) {
      bookChapter.sections[chapterObjLength] = {
        name: '第' + (chapterObjLength + 1) + '节',
        courses: []
      };
      chaptersObj[chapterNum].push(chapterObjLength);
    }
  });

  // 将书本章节信息保存成JSON
  fs.outputFile(fileDir + 'menu.json', JSON.stringify(book), function(err) {
    if (err) {
      console.error(err);
    } else {
      console.log('文件写入完成，地址为:' + fileDir + 'menu.json');
    }
  });

  if (errorArr.length) {
    console.warn('以下文件后缀名不是HTML，已跳过，请检查 -->\n' + errorArr);
  }
}


// 生成书本内容
function generateBookContent(book, files) {
  var bookData = {};

  files.forEach((file) => {
    // 章序号
    let fileName = file.split('.');
    let chapterNum = Number(fileName[0]);
    // 页面在该章的序号
    let pageNum = Number(fileName[1].split('_')[1]);
    let extName = fileName[fileName.length - 1];
    // 过滤非html后缀的文件
    if (extName !== 'html') {
      return true;
    }

    // 若为新的一章，则创建
    if(!_.has(bookData, chapterNum)){
      bookData[chapterNum] = {
        name: '第' + chapterNum + '章',
        pages: []
      };
    }

    // 保存页信息到该章
    bookData[chapterNum].pages.push({
      index: pageNum,
      name: '第' + pageNum + '页',
      data: fs.readFileSync(dir + file, 'utf-8') + '\n\n'
    });
  });

  // 每章中的页面递增排序
  _.forEach(bookData, (chapter) => {
    chapter.pages = _.orderBy(chapter.pages, 'index');
  });

  // 遍历页面，获取节号
  _.forEach(bookData, (chapter) => {
    let sectionNum = 0;
    _.forEach(chapter.pages, (pages) => {
      (pages.data.indexOf(sectionKey) !== -1) && sectionNum++;
      pages.section = !sectionNum ? 1 : sectionNum;
    });
  });

  var bookHtml = getRevealBookString(bookData);
  console.log('文件读取完成，准备写入---------->');
  fs.outputFile(fileDir + 'content_compressed.html', bookHtml, function(err) {
    if (err) {
      console.error(err);
    } else {
      console.log('文件写入完成，地址为:' + fileDir + 'content_compressed.html');
    }
  });

  // 获取Reveal类型的书本内容
  function getRevealBookString(bookData) {
    let bookHtml = '<div class="reveal">\n<div class="slides">\n';
    _.forEach(bookData, (chapter, chapterNum) => {
      let totalPageInChapter = chapter.pages.length;
      _.forEach(chapter.pages, (page, index) => {
        // 左半页
        var pageIndex = Math.ceil(page.index / 2);
        if (page.index % 2 === 1) {
          bookHtml += '<!---第' + chapterNum + '章 - 第' + page.section + '节 - 第' + pageIndex + '页-->\n';
          bookHtml += '<section>\n<div class="bb-item" id="page_' + chapterNum + '_' + page.section + '_0_' + pageIndex + '">\n' + page.data;
          // 章首页
          if (page.index === 1) {
            bookHtml += '</div>\n</section>\n\n';
          }
        } else {
          // 右半页
          bookHtml += page.data + '</div>\n</section>\n\n';
        }

        // 本章最后一页，且最后没有右半页
        if ((index + 1) === totalPageInChapter && (totalPageInChapter % 2 === 0)) {
          bookHtml += '</div>\n</section>\n\n';
        }
      });
    });
    bookHtml += '</div>\n</div>';
    bookHtml += '\n\n<!-- 书本内弹窗遮罩 -->\n<div class="book-mask" ignore="1"></div>';
    return bookHtml;
  }
}
