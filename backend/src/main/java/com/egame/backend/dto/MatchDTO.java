package com.egame.backend.dto;

import com.egame.backend.models.Match;
import com.egame.backend.enums.MatchStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchDTO {
    private Long id;
    private String matchTitle;
    private String gameType;
    private String mapName;
    private int maxPlayers;
    private double entryFee;
    private double prizePerKill;
    private String scheduledTime;
    private MatchStatus status;
    private boolean joined;

    public MatchDTO(Match match, boolean joined) {
        this.id = match.getId();
        this.matchTitle = match.getMatchTitle();
        this.gameType = match.getGameType();
        this.mapName = match.getMapName();
        this.maxPlayers = match.getMaxPlayers();
        this.entryFee = match.getEntryFee();
        this.prizePerKill = match.getPrizePerKill();
        this.scheduledTime = match.getScheduledTime().toString();
        this.status = match.getStatus();
        this.joined = joined;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getMatchTitle() { return matchTitle; }
    public void setMatchTitle(String matchTitle) { this.matchTitle = matchTitle; }
    
    public boolean isJoined() { return joined; }
    public void setJoined(boolean joined) { this.joined = joined; }
    
    // Add other getters and setters
}