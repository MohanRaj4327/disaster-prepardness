package org.disaster.model;

import java.util.List;

public class Quiz {
    private String id;
    private String title;
    private String disasterType;
    private String difficulty; // BEGINNER, INTERMEDIATE, ADVANCED
    private int passingScore;
    private List<Question> questions;

    public static class Question {
        private String id;
        private String text;
        private List<String> options;
        private int correctIndex;
        private String explanation;

        public Question() {}

        public Question(String id, String text, List<String> options, int correctIndex, String explanation) {
            this.id = id;
            this.text = text;
            this.options = options;
            this.correctIndex = correctIndex;
            this.explanation = explanation;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getText() { return text; }
        public void setText(String text) { this.text = text; }

        public List<String> getOptions() { return options; }
        public void setOptions(List<String> options) { this.options = options; }

        public int getCorrectIndex() { return correctIndex; }
        public void setCorrectIndex(int correctIndex) { this.correctIndex = correctIndex; }

        public String getExplanation() { return explanation; }
        public void setExplanation(String explanation) { this.explanation = explanation; }
    }

    public Quiz() {}

    public Quiz(String id, String title, String disasterType, String difficulty, int passingScore, List<Question> questions) {
        this.id = id;
        this.title = title;
        this.disasterType = disasterType;
        this.difficulty = difficulty;
        this.passingScore = passingScore;
        this.questions = questions;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDisasterType() { return disasterType; }
    public void setDisasterType(String disasterType) { this.disasterType = disasterType; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public int getPassingScore() { return passingScore; }
    public void setPassingScore(int passingScore) { this.passingScore = passingScore; }

    public List<Question> getQuestions() { return questions; }
    public void setQuestions(List<Question> questions) { this.questions = questions; }
}
