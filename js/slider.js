define(function(require) {
    var QuestionView = require('coreViews/questionView');
    var Adapt = require('coreJS/adapt');
    require('component/slider/js/rangeslider');

    var Slider = QuestionView.extend({

        events: {
            'input .slider-range': 'onSliderRangeChanged'
        },

        setupQuestion: function() {
        },

        onQuestionRendered: function() {
            var that = this;
            this.setReadyStatus();
            this.$('input[type="range"]').rangeslider({
                polyfill: false,
                rangeClass: 'rangeslider',
                fillClass: 'rangeslider__fill',
                handleClass: 'rangeslider__handle',

                onInit: function() {
                },

                onSlide: function(position, value) {
                    that.onSliderRangeChanged(value);
                },

                onSlideEnd: function(position, value) {
                    that.onSliderRangeChanged(value);
                }
            });
        },

        onSliderRangeChanged: function(value) {
            this.model.set({_selectedAnswer: value});
            this.$('.slider-range-current-value-number').html(value);
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
            console.log(isEnabled);
            if (isEnabled) {
                this.$('.slider-widget').removeClass('disabled');
                this.$('input[type="range"]').prop('disabled', false);
            } else {
                this.$('.slider-widget').addClass('disabled');
                this.$('input[type="range"]').prop('disabled', true);
            }
            this.$('input[type="range"]').rangeslider('update');
        },

        // Used by the question to reset the question when revisiting the component
        resetQuestionOnRevisit: function() {
            this.setAllItemsEnabled(true);
            this.resetQuestion();
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
            var userAnswer = this.model.get('_selectedAnswer');
            this.model.set({
                _userAnswer: userAnswer
            });
        },

        // Used by the question to determine if the question is incorrect or partly correct
        // Should return a boolean
        isPartlyCorrect: function() {
            return false;
        },

        // Used by the question view to reset the stored user answer
        resetUserAnswer: function() {
            this.model.set({
                _userAnswer: ''
            });
        },

        // Used by the question view to reset the look and feel of the component.
        // This could also include resetting item data
        // This is triggered when the reset button is clicked so it shouldn't
        // be a full reset
        resetQuestion: function() {
            this.$('input[type="range"]').val(5).change();
        },

        // Used by the question to display the correct answer to the user
        showCorrectAnswer: function() {
            var correctAnswer = this.model.get('_correctAnswer');
            this.$('input[type="range"]').val(correctAnswer).change();
        },

        // Used by the question to display the users answer and
        // hide the correct answer
        // Should use the values stored in storeUserAnswer
        hideCorrectAnswer: function() {
            var userAnswer = this.model.get('_userAnswer');
            this.$('input[type="range"]').val(userAnswer).change();
        }

    });

    Adapt.register("slider", Slider);

    return Slider;
});
