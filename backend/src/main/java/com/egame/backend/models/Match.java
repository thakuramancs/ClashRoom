package com.egame.backend.models;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.Set;
import com.egame.backend.enums.MatchStatus;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "matches")
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String matchTitle;
    private String gameType;
    private String mapName;
    private Integer maxPlayers;
    private Integer currentPlayers = 0;
    private Double entryFee;
    private Double prizePerKill;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MatchStatus status = MatchStatus.UPCOMING;
    @Column(nullable = false)
    private LocalDateTime scheduledTime;
    
    @ElementCollection
    @CollectionTable(
        name = "match_rank_prizes",
        joinColumns = @JoinColumn(name = "match_id")
    )
    @AttributeOverrides({
        @AttributeOverride(name = "rank", column = @Column(name = "position_rank")),
        @AttributeOverride(name = "prizeAmount", column = @Column(name = "prize_amount"))
    })
    private Set<RankPrize> rankPrizes;

    @Column
    private String roomId;

    @Column
    private String roomPassword;

    @Column
    private Boolean roomDetailsVisible;

    @Column(name = "players", nullable = false)
    private Integer players = 0;

    public Integer getPlayers() {
        return players;
    }

    public void setPlayers(Integer players) {
        this.players = players;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public String getRoomPassword() {
        return roomPassword;
    }

    public void setRoomPassword(String roomPassword) {
        this.roomPassword = roomPassword;
    }

    public Boolean getRoomDetailsVisible() {
        return roomDetailsVisible;
    }

    public void setRoomDetailsVisible(Boolean roomDetailsVisible) {
        this.roomDetailsVisible = roomDetailsVisible;
    }
}