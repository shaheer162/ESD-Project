package com.example.matchescrud.Mapper;

import com.example.matchescrud.dto.PlayerDTO;
import com.example.matchescrud.model.entity.Player;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class PlayerMapper {
    private final TeamMapper teamMapper;

    public PlayerMapper(TeamMapper teamMapper) {
        this.teamMapper = teamMapper;
    }

    public PlayerDTO playerToPlayerDTO(Player player) {
        if (player == null) {
            return null;
        }
        
        PlayerDTO playerDTO = new PlayerDTO();
        playerDTO.setId(player.getId());
        playerDTO.setName(player.getName());
        playerDTO.setPosition(player.getPosition());
        playerDTO.setJerseyNumber(player.getJerseyNumber());
        
        if (player.getTeam() != null) {
            playerDTO.setTeam(teamMapper.teamToTeamDTO(player.getTeam()));
        }
        
        return playerDTO;
    }

    public Player playerDTOToPlayer(PlayerDTO playerDTO) {
        if (playerDTO == null) {
            return null;
        }
        
        Player player = new Player();
        player.setId(playerDTO.getId());
        player.setName(playerDTO.getName());
        player.setPosition(playerDTO.getPosition());
        player.setJerseyNumber(playerDTO.getJerseyNumber());
        
        // Team mapping is typically handled by services
        
        return player;
    }

    public List<PlayerDTO> playerListToPlayerDTOList(List<Player> playerList) {
        if (playerList == null) {
            return null;
        }
        return playerList.stream()
                .map(this::playerToPlayerDTO)
                .collect(Collectors.toList());
    }
}

