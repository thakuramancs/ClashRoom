package com.egame.backend.models;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class RankPrize {
    @Column(name = "position_rank")
    private Integer rank;
    
    @Column(name = "prize_amount")
    private Double prizeAmount;
} 