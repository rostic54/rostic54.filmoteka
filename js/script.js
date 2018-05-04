"use strict";

class Movie {

    constructor(title, year, country, genre, poster, actors, descript, id) {
        this.title = title;
        this.year = year;
        this.country = country;
        this.genre = genre;
        this.poster = poster;
        this.actors = actors;
        this.descript = descript;
    }

    create() {

        var poster = $('#model').clone().attr('id', '');

        poster.find('h2').text(this.title);
        poster.find('.desc__txt').text(this.descript);
        poster.find('.js-country').text(this.country);
        poster.find('.js-year').text(this.year);
        poster.find('.js-genre').text(this.genre);
        poster.find('.js-actors').text(this.actors);
        poster.find('.js-poster > img').attr('src', this.poster);
        poster.find('.js-back-pic').css('background-image', "URL(" + this.poster + ")");
        var btnEdit = poster.find('.js-edit');

        $(btnEdit).on('click', this, this.edit );

        var objDel = $(poster).find('.js-delete');
        objDel.click( function () {
            event.preventDefault();
            $(poster).remove();
        });

        poster.find('.js-add-comment').on('click', additionComment);
        poster.find('.js-show-comments').on('click', commentShow);




        return poster
    }

    edit(event) {
        event.preventDefault();
        var realObj = event.data;
        var currentObj = this.closest('.new-obj');
        var editForm = $('.edit');
        //editForm.toggle('slow');
        editForm.find("input[name='title']").val($(currentObj).find('h2').text());
        editForm.find("textarea[name='desc']").val($(currentObj).find('.desc__txt').text());
        editForm.find("input[name='country']").val($(currentObj).find('.js-country').text());
        editForm.find("input[name='year']").val($(currentObj).find('.js-year').text());
        editForm.find("input[name='genre']").val($(currentObj).find('.js-genre').text());
        editForm.find("input[name='actors']").val($(currentObj).find('.js-actors').text());
        editForm.find("input[name='poster']").val($(currentObj).find('img').attr('src'));

        $('.js-add-movie').off('click');

        if( editForm.is(':hidden') ) {
            formOpenClose();
        }
        $("html, body").animate({scrollTop: 0}, 400);

        $('.js-add-movie').on('click', currentObj, realObj.changeEditing);

    }

    changeEditing(event) {
        var myObj = event.data;
        var formCorrected = this.closest('#movie');
        $(myObj).find('h2').text($(formCorrected).find("input[name='title']").val());
        $(myObj).find('.desc__txt').text($(formCorrected).find("textarea[name='desc']").val());
        $(myObj).find('.js-country').text($(formCorrected).find("input[name='country']").val());
        $(myObj).find('.js-genre').text($(formCorrected).find("input[name='genre']").val());
        $(myObj).find('.js-poster > img').attr('src', $(formCorrected).find("input[name='poster']").val());
        $(myObj).find('.js-actors').text($(formCorrected).find("input[name='actors']").val());
        $(myObj).find('.js-year').text($(formCorrected).find("input[name='year']").val());
        $(myObj).find('.js-back-pic').css('background-image', "URL(" + $(formCorrected).find("input[name='poster']").val() + ")");
        formCorrected.reset();
        formOpenClose();
        $('.js-add-movie').off('click');
        $('.js-add-movie').on('click', movieAddition);

    }

}

function movieAddition() {

    var form = this.closest('#movie');// return form

    if (!( $.isNumeric(form[1].value) ) && form[1].value.length) {
        var error = $(form).find('.js-error').css('display', 'block');
        error.find('span').text('Year - isn\'t number');
        return
    }

    $(form).find('.js-error').css('display', 'none');
    var movie = new Movie(form[0].value, form[1].value, form[2].value, form[3].value, form[4].value, form[5].value, form[6].value);

    form.reset();
    formOpenClose();

    // It's attempt to use localStorage
   /* var serialObj = JSON.stringify( movie );
    movie.counter = localStorage.length;
    localStorage.setItem("myKey" + localStorage.length, serialObj);*/

    var main = $('.content');
    main.append(movie.create());

}

function commentShow() {
    event.preventDefault();
    var commentContainer = $(this).parent().next();
    if( commentContainer.find('p').length ) {
        //commentContainer.toggle('slow');
        if( $(commentContainer).is(':visible') ) {
            commentClose( commentContainer );
        }else{
            commentOpen( commentContainer );
        }
    }
}
function commentOpen( commentContainer ) {
    $(commentContainer).css('display', 'block');
    $(commentContainer).prev().addClass('comment-opened');
}

function commentClose( commentContainer ) {
    $(commentContainer).css('display', 'none');
    $(commentContainer).prev().removeClass('comment-opened');
}

function formOpenClose() {

    $('.edit').toggle('slow');
}

function clearOfForm() {
    var form = this.closest('#movie');
    form.reset();
}
function additionComment(){
    event.preventDefault();
    var form =  $(this).closest('form');
    var comment = form.find('textarea').val();
    var commentContainer = form.siblings( '.comment-container' );

    commentContainer.append("<p class = 'comment-line'>" +  comment + "</p>");
    commentOpen( commentContainer );
    var commentsCounter = $( commentContainer ).find('p');
    form.siblings('.comment-line').find('.js-comment-counter').empty().append( ' ' + commentsCounter.length + ' ' );
    form[0].reset();
}

function listeners() {
    $('.js-form-open').on('click', formOpenClose);
    $('.js-add-movie').on('click', movieAddition);
    $('.js-cancel').on('click', clearOfForm);

}


$(document).ready(function () {

    listeners();

});
