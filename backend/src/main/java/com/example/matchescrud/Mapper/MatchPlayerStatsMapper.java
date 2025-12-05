package com.example.matchescrud.Mapper;

import com.example.matchescrud.dto.MatchPlayerStatsDTO;
import com.example.matchescrud.model.entity.MatchPlayerStats;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class MatchPlayerStatsMapper {
    private final PlayerMapper playerMapper;

    public MatchPlayerStatsMapper(PlayerMapper playerMapper) {
        this.playerMapper = playerMapper;
    }

    public MatchPlayerStatsDTO matchPlayerStatsToDTO(MatchPlayerStats stats) {
        if (stats == null) {
            return null;
        }

        MatchPlayerStatsDTO dto = new MatchPlayerStatsDTO();
        dto.setId(stats.getId());
        dto.setMatchUuid(stats.getMatch().getUuid());
        dto.setPlayer(playerMapper.playerToPlayerDTO(stats.getPlayer()));
        dto.setGoals(stats.getGoals());
        dto.setAssists(stats.getAssists());
        dto.setPasses(stats.getPasses());
        dto.setSaves(stats.getSaves());
        return dto;
    }

    public List<MatchPlayerStatsDTO> matchPlayerStatsListToDTOList(List<MatchPlayerStats> statsList) {
        if (statsList == null) {
            return null;
        }
        return statsList.stream()
                .map(this::matchPlayerStatsToDTO)
                .collect(Collectors.toList());
    }
}

