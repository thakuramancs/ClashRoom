package com.egame.backend.repositories;

import com.egame.backend.models.PlayerMatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import org.springframework.stereotype.Repository;


@Repository
public interface PlayerMatchRepository extends JpaRepository<PlayerMatch, Long> {
    boolean existsByMatchIdAndPlayerId(Long matchId, Long playerId);
    
    @Query("SELECT pm FROM PlayerMatch pm WHERE pm.match.id = :matchId AND pm.player.id = :playerId")
    List<PlayerMatch> findByMatchIdAndPlayerId(@Param("matchId") Long matchId, @Param("playerId") Long playerId);

    List<PlayerMatch> findByMatchId(Long matchId);

    void deleteByMatchIdAndPlayerId(Long matchId, Long playerId);
} 