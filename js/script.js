"use strict";

class Movie {

    constructor(form) {

        if ($(form).attr('id')) {
            this.title = $(form).find("input[name='title']").val();
            this.year = $(form).find("input[name='year']").val();
            this.country = $(form).find("input[name='country']").val();
            this.genre = $(form).find("input[name='genre']").val();
            this.poster = $(form).find("input[name='poster']").val();
            this.actors = $(form).find("input[name='actors']").val();
            this.descript = $(form).find("textarea[name='desc']").val();
            this.comments = {};
            this.attr = '';
        } else {
            this.title = form.title;
            this.year = form.year;
            this.country = form.country;
            this.genre = form.genre;
            this.poster = form.poster;
            this.actors = form.actors;
            this.descript = form.descript;
            this.comments = form.comments;
            this.attr = form.attr;
        }
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

        var counterOfcomments = 0;
        for (var key in this.comments) {
            poster.find('.comment-container').append(this.comments[key]);
            counterOfcomments++;
        }
        if( counterOfcomments) {
            poster.find('.js-comment-counter').text(counterOfcomments);
        }


        poster.find('.js-edit').on('click', this, this.edit);

        poster.find('.js-delete').on( 'click', this, this.deleteMovie );

        poster.find('.js-add-comment').on('click', this, additionComment);
        poster.find('.js-show-comments').on('click', commentShow);


        return poster.attr('data-key', this.attr);
    }

    deleteMovie( event ){
        event.preventDefault();
        var objAttr = event.data.attr;
        localStorage.removeItem( objAttr );
        delete event.data;
        $(this).closest('.new-obj').remove();
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

        if (editForm.is(':hidden')) {
            toggleForm();
        }
        $("html, body").animate({scrollTop: 0}, 400);

        $('.js-add-movie').on('click', realObj, realObj.makeEditing);


    }

    makeEditing(event) {
        var currentObj = event.data;
        var attrValue = "[data-key = '" + currentObj.attr + "']";
        var myObj = $('.content').find(attrValue);
        var formCorrected = this.closest('#movie');

        currentObj.title = $(formCorrected).find("input[name='title']").val();
        $(myObj).find('h2').text($(formCorrected).find("input[name='title']").val());

        currentObj.descript = $(formCorrected).find("textarea[name='desc']").val();
        $(myObj).find('.desc__txt').text($(formCorrected).find("textarea[name='desc']").val());

        currentObj.country = $(formCorrected).find("input[name='country']").val();
        $(myObj).find('.js-country').text($(formCorrected).find("input[name='country']").val());

        currentObj.genre = $(formCorrected).find("input[name='genre']").val();
        $(myObj).find('.js-genre').text($(formCorrected).find("input[name='genre']").val());

        currentObj.poster = $(formCorrected).find("input[name='poster']").val();
        $(myObj).find('.js-poster > img').attr('src', $(formCorrected).find("input[name='poster']").val());

        currentObj.actors = $(formCorrected).find("input[name='actors']").val();
        $(myObj).find('.js-actors').text($(formCorrected).find("input[name='actors']").val());

        currentObj.year = $(formCorrected).find("input[name='year']").val();
        $(myObj).find('.js-year').text($(formCorrected).find("input[name='year']").val());

        $(myObj).find('.js-back-pic').css('background-image', "URL(" + $(formCorrected).find("input[name='poster']").val() + ")");
        formCorrected.reset();
        toggleForm();
        $('.js-add-movie').off('click');
        $('.js-add-movie').on('click', movieAddition);
        localStorage.removeItem( currentObj.attr ) ;
        setInLocalStorage( currentObj );
    }

    fillingOutOfObject(){

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
    var movie = new Movie(form);

    form.reset();
    toggleForm();

    var main = $('.content');
    var attrName = 'myKey' + localStorage.length;
    movie.attr = attrName;
    var serialObj = JSON.stringify(movie);
    main.append(movie.create());
    localStorage.setItem("myKey" + localStorage.length, serialObj);

}

function setInLocalStorage( obj ) {
    var serialObj = JSON.stringify( obj );
    localStorage.setItem( obj.attr , serialObj);
}

function getObjectsFromLocalStorage() {

    if (localStorage.getItem("myKey" + ( localStorage.length - 1)) !== null) {
        var counter = localStorage.length - 1;
        while (localStorage.getItem("myKey" + counter)) {
            var main = $('.content');
            var returnObj = JSON.parse(localStorage.getItem("myKey" + counter));
            var movie = new Movie(returnObj);
            main.append(movie.create());
            counter--;
        }
    }
}

function commentShow() {
    event.preventDefault();
    var commentContainer = $(this).parent().next();
    if (commentContainer.find('p').length) {

        if ($(commentContainer).is(':visible')) {
            commentClose(commentContainer);
        } else {
            commentOpen(commentContainer);
        }
    }
}
function commentOpen(commentContainer) {
    $(commentContainer).css('display', 'block');
    $(commentContainer).prev().addClass('comment-opened');
}

function commentClose(commentContainer) {
    $(commentContainer).css('display', 'none');
    $(commentContainer).prev().removeClass('comment-opened');
}

function toggleForm() {

    $('.edit').toggle('slow');
}

function clearOfForm() {
    var form = this.closest('#movie');
    form.reset();
}


function additionComment(event) {
    event.preventDefault();
    var form = $(this).closest('form');

    var comment = form.find('textarea').val(); // get text of new comment
    if (comment.length && !(comment.trim() === '' ) ) {
        var commentContainer = form.siblings('.comment-container');


        addCommentInLocalStorage(event.data, ("<p class = 'comment-line'>" + comment + "</p>")); // it adds new comment in
        commentContainer.append("<p class = 'comment-line'>" + comment + "</p>");

        commentOpen(commentContainer);
        var commentsCounter = $(commentContainer).find('p');
        form.siblings('.comment-line').find('.js-comment-counter').empty().append(' ' + commentsCounter.length + ' ');
        form[0].reset();
    }
    form[0].reset();
}

function addCommentInLocalStorage(obj, commentTxt) {
    var objOfComment = obj.comments;
    var countObjElem = 0;
    for (var key in objOfComment) {
        countObjElem++;
    }
    objOfComment[countObjElem] = commentTxt;
    localStorage.setItem(obj.attr, JSON.stringify(obj));
}

function listeners() {
    $('.js-form-open').on('click', toggleForm);
    $('.js-add-movie').on('click', movieAddition);
    $('.js-cancel').on('click', clearOfForm);
}


$(document).ready(function () {

    listeners();
    getObjectsFromLocalStorage();

});
