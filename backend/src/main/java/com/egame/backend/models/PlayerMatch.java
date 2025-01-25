package com.egame.backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class PlayerMatch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "player_id")
    private Users player;
    
    @ManyToOne
    @JoinColumn(name = "match_id")
    private Match match;
    
    private String inGameName;
    private LocalDateTime joinedAt;
    private Integer kills;
    
    private Integer positionRank;
    
    private Double prizeMoney;
    private String status;
} 