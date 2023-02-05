'use strict';

$(document).ready( function() {

  const AnimalData = function(image_url, title, description, keyword, horns) {
    this.image_url = image_url;
    this.title = title;
    this.description = description;
    this.keyword = keyword;
    this.horns = horns;
  };

  const ajaxSettings = {
    method: 'get',
    dataType: 'json'
  };

  const allData = [];

  $.ajax('data/page-1.json', ajaxSettings)
    .then(data => {
      data.forEach(obj => {
        obj = new AnimalData(obj.image_url, obj.title, obj.description, obj.keyword, obj.horns);
        allData.push(obj);
        const name = $('<h2></h2>').text(obj.title);
        $('#content').append(name);
        name.attr('class', obj.keyword);
        const photo = $('<img>').attr('src', obj.image_url);
        $('#content').append(photo);
        photo.attr('class', obj.keyword);
        const des = $('<p></p>').text(obj.description);
        $('#content').append(des);
        des.attr('class', obj.keyword);

        for(let i = 0; i < name.length; i++) {
          const div = $('<div></div>').attr('class', 'card ' + obj.keyword);
          div.append(name.eq(i));
          div.append(photo.eq(i));
          div.append(des.eq(i));
          $('#content').append(div);
        }
      });

      const spamKeywords = [];
      let keywords = 0;

      for(let i = 0; i < data.length; i++){
        if(!spamKeywords.includes(data[i].keyword)) {
          keywords = $('<option></option>').text(data[i].keyword);
          $('select').append(keywords);
          spamKeywords.push(data[i].keyword);
        }
      }

      $('select').on('change', function () {
        let $selected = $(this).val();
        if ($selected !== 'default') {
          $('.card').hide();

          allData.forEach(image => {
            if ($selected === image.keyword) {
              if ($(`div`).hasClass('filtered')){
                $('div').removeClass('filtered');
                $(`div[class="card ${$selected}"]`).addClass('filtered').fadeIn();
              } else {
                $(`div[class="card ${$selected}"]`).addClass('filtered').fadeIn();
              }
            }
          });

          $(`option[value=${$selected}]`).fadeIn();
        } else {
          $('div').removeClass('filtered').fadeIn();
          $(`option[value=${$selected}]`).fadeIn();
        }
      });
    });
});
