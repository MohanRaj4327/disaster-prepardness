package org.disaster.model;

import java.time.Instant;

public class QuizResult {
    private String id;
    private String userId;
    private String userName;
    private String quizId;
    private String quizTitle;
    private int score;
    private int maxScore;
    private double percentage;
    private boolean passed;
    private String certificateNumber;
    private String completedAt;

    public QuizResult() {
        this.completedAt = Instant.now().toString();
    }

    public QuizResult(String id, String userId, String userName, String quizId, 
                      String quizTitle, int score, int maxScore, boolean passed, 
                      String certificateNumber) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.quizId = quizId;
        this.quizTitle = quizTitle;
        this.score = score;
        this.maxScore = maxScore;
        this.percentage = maxScore > 0 ? ((double) score / maxScore) * 100.0 : 0.0;
        this.passed = passed;
        this.certificateNumber = certificateNumber;
        this.completedAt = Instant.now().toString();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getQuizId() { return quizId; }
    public void setQuizId(String quizId) { this.quizId = quizId; }

    public String getQuizTitle() { return quizTitle; }
    public void setQuizTitle(String quizTitle) { this.quizTitle = quizTitle; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public int getMaxScore() { return maxScore; }
    public void setMaxScore(int maxScore) { this.maxScore = maxScore; }

    public double getPercentage() { return percentage; }
    public void setPercentage(double percentage) { this.percentage = percentage; }

    public boolean isPassed() { return passed; }
    public void setPassed(boolean passed) { this.passed = passed; }

    public String getCertificateNumber() { return certificateNumber; }
    public void setCertificateNumber(String certificateNumber) { this.certificateNumber = certificateNumber; }

    public String getCompletedAt() { return completedAt; }
    public void setCompletedAt(String completedAt) { this.completedAt = completedAt; }
}
