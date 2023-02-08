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

  let allData = [];

  $.ajax( (window.location.href.indexOf('index.html') !== -1) ? '../data/page-1.json' : '../data/page-2.json', ajaxSettings)
    .then(data => {
      data.forEach(obj => {
        allData.push(new AnimalData(obj.image_url, obj.title, obj.description, obj.keyword, obj.horns));
      });

      allData.sort( (a, b) => {
        return a.title > b.title ? 1 : a.title < b.title ? -1 : 0;
      });

      let template = $('#photo-template').html();
      let output = Mustache.render(template, {allData: allData});
      $('#content').append(output);

      $('input').click(function() {
        const sortBy =($('input[name="sort-by"]:checked').val());
        const currentOption = $('select').val();

        if(sortBy === 'title'){
          $('#content > .card').remove();
          allData.sort( (a, b) => {
            return a.title > b.title ? 1 : a.title < b.title ? -1 : 0;
          });
          output = Mustache.render(template, {allData: allData});
          $('#content').append(output);
          $('select').val(currentOption).trigger('change');
        } else if(sortBy === 'horns'){
          $('#content > .card').remove();
          allData.sort( (a, b) => {
            return a.horns > b.horns ? 1 : a.horns < b.horns ? -1 : 0;
          });
          output = Mustache.render(template, {allData: allData});
          $('#content').append(output);
          $('select').val(currentOption).trigger('change');
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

      $('select').on('change', renderFilter);

      function renderFilter () {
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
      }

    });
});
