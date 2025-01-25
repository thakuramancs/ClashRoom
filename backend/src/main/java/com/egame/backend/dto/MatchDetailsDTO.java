package com.egame.backend.dto;

import com.egame.backend.models.Match;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchDetailsDTO {
    private Long id;
    private String matchTitle;
    private boolean joined;
    private boolean roomDetailsVisible;
    private String roomId;
    private String roomPassword;
    private Long timeToVisibility;

    public MatchDetailsDTO(Match match, boolean joined, boolean roomDetailsVisible, 
                         String roomId, String roomPassword, long timeToVisibility) {
        this.id = match.getId();
        this.matchTitle = match.getMatchTitle();
        this.joined = joined;
        this.roomDetailsVisible = roomDetailsVisible;
        this.roomId = roomId;
        this.roomPassword = roomPassword;
        this.timeToVisibility = timeToVisibility;
    }
} 