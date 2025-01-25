package com.egame.backend.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlayerMatchDTO {
    private Long id;
    private String username;
    private String inGameName;
    private LocalDateTime joinedAt;
    private Integer kills;
    private Integer positionRank;
    private Double prizeMoney;
    private String status;
}