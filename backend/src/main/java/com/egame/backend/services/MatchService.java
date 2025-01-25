package com.egame.backend.services;

import com.egame.backend.models.Match;
import com.egame.backend.models.PlayerMatch;
import com.egame.backend.models.Users;
import com.egame.backend.repositories.MatchRepository;
import com.egame.backend.repositories.PlayerMatchRepository;
import com.egame.backend.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import com.egame.backend.dto.PlayerMatchDTO;
import com.egame.backend.enums.MatchStatus;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import com.egame.backend.dto.MatchDetailsDTO;
import com.egame.backend.dto.MatchDTO;

@Service
@Transactional
public class MatchService {
    private final MatchRepository matchRepository;
    private final PlayerMatchRepository playerMatchRepository;
    private final UserRepository userRepository;

    private static final DateTimeFormatter DEBUG_FORMATTER = 
        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Autowired
    public MatchService(MatchRepository matchRepository, PlayerMatchRepository playerMatchRepository, UserRepository userRepository) {
        this.matchRepository = matchRepository;
        this.playerMatchRepository = playerMatchRepository;
        this.userRepository = userRepository;
    }

    public Match createMatch(Match match) {
        match.setCurrentPlayers(0);
        match.setStatus(MatchStatus.UPCOMING);
        if (match.getRoomDetailsVisible() == null) {
            match.setRoomDetailsVisible(false);
        }
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime scheduledTime = match.getScheduledTime();
        
        // Debug logs
        System.out.println("Create match attempt:");
        System.out.println("Current time: " + now.format(DEBUG_FORMATTER));
        System.out.println("Scheduled time: " + scheduledTime.format(DEBUG_FORMATTER));
        
        if (scheduledTime.isBefore(now)) {
            throw new RuntimeException("Selected time must be in the future");
        }
        
        return matchRepository.save(match);
    }

    public List<Match> getAllMatches() {
        return matchRepository.findAll();
    }

    @Transactional
    public Match joinMatch(Long matchId, String username) {
        Match match = matchRepository.findById(matchId)
            .orElseThrow(() -> new RuntimeException("Match not found"));

        // Get user by username
        Users user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime scheduledTime = match.getScheduledTime();

        // Debug logs
        System.out.println("Join attempt details:");
        System.out.println("Current time: " + now.format(DEBUG_FORMATTER));
        System.out.println("Match scheduled time: " + scheduledTime.format(DEBUG_FORMATTER));
        System.out.println("Time difference (minutes): " + 
            ChronoUnit.MINUTES.between(now, scheduledTime));

        // Check if match can be joined
        if (now.isAfter(scheduledTime)) {
            throw new RuntimeException("Cannot join match after its scheduled time");
        }

        if (match.getStatus() == MatchStatus.CANCELLED) {
            throw new RuntimeException("Cannot join cancelled match");
        }

        if (match.getCurrentPlayers() >= match.getMaxPlayers()) {
            throw new RuntimeException("Match is full");
        }

        // Check if player already joined
        if (playerMatchRepository.existsByMatchIdAndPlayerId(matchId, user.getId())) {
            throw new RuntimeException("Already joined this match");
        }

        // Create player-match relationship
        PlayerMatch playerMatch = new PlayerMatch();
        playerMatch.setMatch(match);
        playerMatch.setPlayer(user);
        playerMatchRepository.save(playerMatch);

        // Update current players count
        match.setCurrentPlayers(match.getCurrentPlayers() + 1);
        return matchRepository.save(match);
    }

    public List<PlayerMatchDTO> getMatchPlayers(Long matchId) {
        System.out.println("Service: Fetching players for match ID: " + matchId);
        try {
            // First verify the match exists
            Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found with ID: " + matchId));
            System.out.println("Service: Found match: " + match);

            // Get players
            List<PlayerMatch> players = playerMatchRepository.findByMatchId(matchId);
            System.out.println("Service: Raw players data: " + players);

            List<PlayerMatchDTO> dtos = players.stream()
                .map(pm -> {
                    System.out.println("Service: Converting player: " + pm.getPlayer().getUsername());
                    return PlayerMatchDTO.builder()
                        .id(pm.getId())
                        .username(pm.getPlayer().getUsername())
                        .inGameName(pm.getInGameName())
                        .joinedAt(pm.getJoinedAt())
                        .kills(pm.getKills())
                        .positionRank(pm.getPositionRank())
                        .prizeMoney(pm.getPrizeMoney())
                        .status(pm.getStatus())
                        .build();
                })
                .collect(Collectors.toList());

            System.out.println("Service: Converted DTOs: " + dtos);
            return dtos;
        } catch (Exception e) {
            System.out.println("Service: Error getting match players: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Transactional
    public void deleteMatch(Long matchId) {
        try {
            // Check if match exists
            Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

            // Check if match has players
            List<PlayerMatch> players = playerMatchRepository.findByMatchId(matchId);
            if (!players.isEmpty()) {
                throw new RuntimeException("Cannot delete match with registered players");
            }

            // Safe to delete
            matchRepository.delete(match);
            matchRepository.flush();
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete match: " + e.getMessage());
        }
    }

    public Match getMatch(Long matchId) {
        System.out.println("Service: Fetching match with ID: " + matchId);
        try {
            Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found with ID: " + matchId));
            System.out.println("Service: Found match: " + match);
            return match;
        } catch (Exception e) {
            System.out.println("Service: Error finding match: " + e.getMessage());
            throw e;
        }
    }

    @Transactional
    public void updateMatchStatuses() {
        LocalDateTime now = LocalDateTime.now();
        List<Match> matches = matchRepository.findAll();
        
        for (Match match : matches) {
            if (match.getStatus() == MatchStatus.CANCELLED) {
                continue;
            }

            LocalDateTime scheduledTime = match.getScheduledTime();
            LocalDateTime matchEndTime = scheduledTime.plusHours(1);

            // Debug logs
            System.out.println("Updating match status:");
            System.out.println("Match ID: " + match.getId());
            System.out.println("Current time: " + now.format(DEBUG_FORMATTER));
            System.out.println("Scheduled time: " + scheduledTime.format(DEBUG_FORMATTER));

            if (now.isBefore(scheduledTime)) {
                match.setStatus(MatchStatus.UPCOMING);
            } else if (now.isBefore(matchEndTime)) {
                match.setStatus(MatchStatus.LIVE);
            } else {
                match.setStatus(MatchStatus.FINISHED);
            }
        }
        matchRepository.saveAll(matches);
    }

    public Match cancelMatch(Long matchId) {
        Match match = matchRepository.findById(matchId)
            .orElseThrow(() -> new RuntimeException("Match not found"));
            
        if (match.getStatus() == MatchStatus.FINISHED) {
            throw new RuntimeException("Cannot cancel a finished match");
        }
        
        match.setStatus(MatchStatus.CANCELLED);
        return matchRepository.save(match);
    }

    public Match updateMatch(Long id, Match updatedMatch) {
        Match existingMatch = matchRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Match not found"));
            
        // Update fields
        existingMatch.setMatchTitle(updatedMatch.getMatchTitle());
        existingMatch.setGameType(updatedMatch.getGameType());
        existingMatch.setMapName(updatedMatch.getMapName());
        existingMatch.setMaxPlayers(updatedMatch.getMaxPlayers());
        existingMatch.setEntryFee(updatedMatch.getEntryFee());
        existingMatch.setPrizePerKill(updatedMatch.getPrizePerKill());
        
        // Don't update sensitive fields
        // existingMatch.setStatus(updatedMatch.getStatus());
        // existingMatch.setCurrentPlayers(updatedMatch.getCurrentPlayers());
        
        return matchRepository.save(existingMatch);
    }

    public Match updateRoomDetails(Long matchId, String roomId, String roomPassword) {
        Match match = matchRepository.findById(matchId)
            .orElseThrow(() -> new RuntimeException("Match not found"));

        // Add debug logging
        System.out.println("Updating room details for match: " + matchId);
        System.out.println("Room ID: " + roomId);
        System.out.println("Room Password: " + roomPassword);
            
        match.setRoomId(roomId);
        match.setRoomPassword(roomPassword);
        
        // Set visibility based on time
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime visibilityTime = match.getScheduledTime().minusMinutes(15);
        match.setRoomDetailsVisible(now.isAfter(visibilityTime));
        
        Match updatedMatch = matchRepository.save(match);
        
        // Verify update
        System.out.println("Updated room details - Room ID: " + updatedMatch.getRoomId());
        
        return updatedMatch;
    }

    public MatchDetailsDTO getMatchDetails(Long matchId, String username) {
        Match match = matchRepository.findById(matchId)
            .orElseThrow(() -> new RuntimeException("Match not found"));

        // Check if user has joined the match
        boolean hasJoined = playerMatchRepository.existsByMatchIdAndPlayerId(matchId, 
            userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId());
        
        if (!hasJoined) {
            return new MatchDetailsDTO(match, false, false, null, null, 0);
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime matchTime = match.getScheduledTime();
        LocalDateTime visibilityTime = matchTime.minusMinutes(15);
        
        boolean showRoomDetails = now.isAfter(visibilityTime);
        long minutesUntilVisible = 0;
        
        if (!showRoomDetails) {
            minutesUntilVisible = ChronoUnit.MINUTES.between(now, visibilityTime);
        }

        return new MatchDetailsDTO(
            match,
            hasJoined,
            showRoomDetails,
            showRoomDetails ? match.getRoomId() : null,
            showRoomDetails ? match.getRoomPassword() : null,
            minutesUntilVisible
        );
    }

    public List<MatchDTO> getAllMatchesWithJoinStatus(String username) {
        try {
            List<Match> matches = matchRepository.findAll();
            
            if (username.equals("anonymousUser")) {
                System.out.println("Anonymous user detected");
                return matches.stream()
                    .map(match -> new MatchDTO(match, false))
                    .collect(Collectors.toList());
            }

            System.out.println("Getting matches for user: " + username);
            Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
            System.out.println("Found user with ID: " + user.getId());

            return matches.stream()
                .map(match -> {
                    List<PlayerMatch> playerMatches = playerMatchRepository.findByMatchIdAndPlayerId(match.getId(), user.getId());
                    boolean hasJoined = !playerMatches.isEmpty();
                    
                    System.out.println(String.format(
                        "Match ID: %d, User ID: %d, PlayerMatches found: %d, Joined: %b",
                        match.getId(), user.getId(), playerMatches.size(), hasJoined
                    ));
                    
                    // Debug: Print actual PlayerMatch records if any found
                    if (!playerMatches.isEmpty()) {
                        playerMatches.forEach(pm -> 
                            System.out.println("PlayerMatch record - Match: " + pm.getMatch().getId() + 
                                             ", Player: " + pm.getPlayer().getId())
                        );
                    }
                    
                    return new MatchDTO(match, hasJoined);
                })
                .collect(Collectors.toList());
        } catch (Exception e) {
            System.out.println("Error in getAllMatchesWithJoinStatus: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public void exitMatch(Long matchId, String username) {
        Match match = matchRepository.findById(matchId)
            .orElseThrow(() -> new RuntimeException("Match not found"));
            
        Users user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user is in the match
        if (!playerMatchRepository.existsByMatchIdAndPlayerId(matchId, user.getId())) {
            throw new RuntimeException("You are not in this match");
        }

        // Check if it's within 15 minutes of match time
        LocalDateTime fifteenMinutesBefore = match.getScheduledTime().minusMinutes(15);
        if (LocalDateTime.now().isAfter(fifteenMinutesBefore)) {
            throw new RuntimeException("Cannot exit match within 15 minutes of start time");
        }

        // Remove user from match
        playerMatchRepository.deleteByMatchIdAndPlayerId(matchId, user.getId());
        match.setCurrentPlayers(match.getCurrentPlayers() - 1);
        matchRepository.save(match);
    }
} 