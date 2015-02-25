define(function(require) {
    var QuestionView = require('coreViews/questionView');
    var Adapt = require('coreJS/adapt');

    var Slider = QuestionView.extend({

        events: {
            'click .slider-handle': 'preventEvent',
            'mousedown .slider-handle': 'onHandlePressed',
            'touchstart .slider-handle':'onHandlePressed'
        },

        setupQuestion: function() {
            this.model.set({
                _selectedAnswer: 0
            });
            var totalRange = this.model.get('_range')._max - this.model.get('_range')._min;
            this.model.set({
                _totalRange: totalRange
            });
        },

        onQuestionRendered: function() {
            this.setupSliderMarkers();
            this.setReadyStatus();
        },

        setupSliderMarkers: function() {
            var totalRange = this.model.get('_totalRange');
            this.$('.slider-marker').css({
                width: (100 / totalRange) + '%'
            });
        },

        preventEvent: function(event) {
            event.preventDefault();
        },

        onHandlePressed: function (event) {
            event.preventDefault();
            if (!this.model.get("_isEnabled") || this.model.get("_isSubmitted")) return;

            var eventData = {
                width: this.$('.slider-bar').width(),
                offsetLeft: this.$('.slider-bar').offset().left
            };

            this.$('.slider-indicator').addClass('show');

            $(document).on('mousemove touchmove', eventData, _.bind(this.onHandleDragged, this));
            $(document).one('mouseup touchend', eventData, _.bind(this.onDragReleased, this));
        },

        onHandleDragged: function (event) {
            event.preventDefault();
            var left = (event.pageX || event.originalEvent.touches[0].pageX) - event.data.offsetLeft;
            left = Math.max(Math.min(left, event.data.width), 0);

            var percentage = (left / event.data.width) * 100;
            var index = Math.round((percentage / 100) * this.model.get('_totalRange'));

            this.moveToPosition(index);
            this.selectSliderMarkers(index);
            this.updateSliderIndicator(index);
            this.selectItem(index);
        },

        onDragReleased: function (event) {
            event.preventDefault();
            $(document).off('mousemove touchmove');
            this.$('.slider-indicator').removeClass('show');
        },

        moveToPosition: function(index) {
            var widthIncrement = 100 / this.model.get('_totalRange');
            var newPosition = widthIncrement * index;
            this.$('.slider-handle, .slider-indicator').css({
                left: newPosition + '%'
            });
        },

        selectItem: function(index) {
            this.model.set({
                _selectedAnswer: index
            });
        },

        selectSliderMarkers: function(itemIndex) {
            var $sliderMarker = this.$('.slider-marker');
            $sliderMarker.removeClass('selected');
            $sliderMarker.slice(0, itemIndex).addClass('selected');
        },

        updateSliderIndicator: function(index) {
            this.$('.slider-indicator-number').html(index);
        },

        // Used by question to disable the question during submit and complete stages
        disableQuestion: function() {
            this.setAllItemsEnabled(false);
        },

        // Used by question to enable the question during interactions
        enableQuestion: function() {
            this.setAllItemsEnabled(true);
        },
        
        setAllItemsEnabled: function(isEnabled) {
            if (isEnabled) {
                this.$('.slider-widget').removeClass('disabled');
            } else {
                this.$('.slider-widget').addClass('disabled');
            }
        },

        // Used by the question to reset the question when revisiting the component
        resetQuestionOnRevisit: function() {
            this.setAllItemsEnabled(true);
            this.deselectAllItems();
            this.resetQuestion();
        },

        deselectAllItems: function() {
            this.selectItem(0);
        },

        // Use to check if the user is allowed to submit the question
        // Maybe the user has to select an item?
        canSubmit: function() {
            return true;
        },

        // Should return a boolean based upon whether to question is correct or not
        isCorrect: function() {
            if (this.model.get('_selectedAnswer') == this.model.get('_correctAnswer')) {
                return true;
            } else {
                return false;
            }
        },

        // Used to set the score based upon the _questionWeight
        setScore: function() {
            var score = this.model.get("_questionWeight");
            this.model.set('_score', score);
        },

        //This preserve the state of the users answers for returning or showing the users answer
        storeUserAnswer: function() {
            this.model.set('_userAnswer', this.model.get('_selectedAnswer'));
        },

        // Used by the question to determine if the question is incorrect or partly correct
        // Should return a boolean
        isPartlyCorrect: function() {
            if (this.model.get('_selectedAnswer') == this.model.get('_correctAnswer')) {
                return true;
            } else {
                return false;
            }
        },

        // Used by the question view to reset the stored user answer
        resetUserAnswer: function() {
            this.model.set({
                _selectedAnswer: 0,
                _userAnswer: ''
            });
        },

        // Used by the question view to reset the look and feel of the component.
        // This could also include resetting item data
        // This is triggered when the reset button is clicked so it shouldn't
        // be a full reset
        resetQuestion: function() {
            this.moveToPosition(0);
            this.selectSliderMarkers(0);
            this.selectItem(0);
            this.updateSliderIndicator(0);
        },

        // Used by the question to display the correct answer to the user
        showCorrectAnswer: function() {
            this.showAnswer(this.model.get('_correctAnswer'));
        },

        // Used by the question to display the users answer and
        // hide the correct answer
        // Should use the values stored in storeUserAnswer
        hideCorrectAnswer: function() {
            this.showAnswer(this.model.get('_userAnswer'));
        },

        showAnswer: function(index) {
            this.selectSliderMarkers(index);
            this.moveToPosition(index);
            this.updateSliderIndicator(index);
        }

    });

    Adapt.register("slider", Slider);

    return Slider;
});
