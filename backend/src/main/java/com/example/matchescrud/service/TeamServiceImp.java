package com.example.matchescrud.service;

import com.example.matchescrud.Mapper.CityMapper;
import com.example.matchescrud.Mapper.DivisionMapper;
import com.example.matchescrud.Mapper.StadiumMapper;
import com.example.matchescrud.Mapper.TeamMapper;
import com.example.matchescrud.dto.CityDTO;
import com.example.matchescrud.dto.DivisionDTO;
import com.example.matchescrud.dto.StadiumDTO;
import com.example.matchescrud.dto.TeamDTO;
import com.example.matchescrud.dto.TeamDashboardDTO;
import com.example.matchescrud.dto.TeamLoginDTO;
import com.example.matchescrud.dto.TeamMatchHistoryDTO;
import com.example.matchescrud.dto.TeamRegisterDTO;
import com.example.matchescrud.exceptions.AlreadyExistException.TeamAlreadyExist;
import com.example.matchescrud.exceptions.AlreadyExistException.TeamCredentialsAlreadyExist;
import com.example.matchescrud.exceptions.ApiException;
import com.example.matchescrud.exceptions.NotFoundExceptions.CityNotFoundException;
import com.example.matchescrud.exceptions.NotFoundExceptions.TeamLoginException;
import com.example.matchescrud.exceptions.NotFoundExceptions.TeamNotFoundException;
import com.example.matchescrud.model.entity.*;
import com.example.matchescrud.repository.MatchRepository;
import com.example.matchescrud.repository.PlayerRepository;
import com.example.matchescrud.repository.TeamRepository;
import com.example.matchescrud.service.interfaces.ITeamService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TeamServiceImp implements ITeamService {


    //Dependency inyection
    TeamRepository teamRepository;
    TeamMapper teamMapper;
    CityMapper cityMapper;
    StadiumMapper stadiumMapper;
    DivisionMapper divisionMapper;
    StadiumServiceImp stadiumServiceImp;
    DivisionServiceImp divisionServiceImp;
    CityServiceImp cityServiceImp;
    PlayerRepository playerRepository;
    MatchRepository matchRepository;
    
    public TeamServiceImp(TeamRepository teamRepository, TeamMapper teamMapper, StadiumServiceImp stadiumServiceImp,
                          DivisionServiceImp divisionServiceImp, CityServiceImp cityServiceImp, DivisionMapper divisionMapper, StadiumMapper stadiumMapper, CityMapper cityMapper, PlayerRepository playerRepository, MatchRepository matchRepository) {
        //Repository
        this.teamRepository = teamRepository;
        this.playerRepository = playerRepository;
        this.matchRepository = matchRepository;
        //Service
        this.cityServiceImp = cityServiceImp;
        this.stadiumServiceImp = stadiumServiceImp;
        this.divisionServiceImp = divisionServiceImp;
        //Mappers
        this.teamMapper = teamMapper;
        this.cityMapper = cityMapper;
        this.stadiumMapper = stadiumMapper;
        this.divisionMapper = divisionMapper;
    }


    //POST
    @Transactional
    @Override
    public TeamDTO createTeam(TeamDTO teamDTO) throws ApiException{
        // Converts TeamDTO a Team
        Team team = new Team();
        Division division = new Division();
        City city = new City();
        Stadium stadium = new Stadium();
        Optional<Team> optionalTeam = teamRepository.findByName(teamDTO.getName());

        if(optionalTeam.isPresent()){
            throw new TeamAlreadyExist(optionalTeam.get().getName());
        }

        //Set attributes via object ID or creates a new one
        if( teamDTO.getDivision().getId() != null){
             division = divisionMapper.divisionDTOToDivision(divisionServiceImp.getDivisionById(teamDTO.getDivision().getId()));
        }else{
             division = divisionMapper.divisionDTOToDivision(divisionServiceImp.createDivision(teamDTO.getDivision()));
        }
        if(teamDTO.getCity() != null) {
            if( teamDTO.getCity().getId() != null){
                city = cityMapper.cityDTOToCity(cityServiceImp.getCityById(teamDTO.getCity().getId()));
            }else{
                city = cityMapper.cityDTOToCity(cityServiceImp.createCity(teamDTO.getCity()));
            }
        }
        if(teamDTO.getStadium() != null) {
            if( teamDTO.getStadium().getId() != null){
                stadium = stadiumMapper.stadiumDTOToStadium(stadiumServiceImp.getStadiumById(teamDTO.getStadium().getId()));
            }else{
                stadium = stadiumMapper.stadiumDTOToStadium(stadiumServiceImp.createStadium(teamDTO.getStadium()));
            }
        }

        team.setName(teamDTO.getName());
        team.setDivision(division);
        team.setCity(city);
        team.setStadium(stadium);
        //Initialize empty matches list
        List<Match> awayMatches = new ArrayList<>();
        List<Match> homeMatches = new ArrayList<>();
        team.setHomeMatches(homeMatches);
        team.setAwayMatches(awayMatches);

        // Save Team in DB
        return teamMapper.teamToTeamDTO(teamRepository.save(team));

    }

    //GET
    @Transactional
    @Override
    public List<TeamDTO> getAllTeams() {
        List<Team> teams = teamRepository.findAll();
        return teamMapper.teamListToTeamDTOList(teams);
    }

    //GET
    @Transactional
    @Override
    public TeamDTO getTeamById(Long id) throws ApiException {
        Team team = teamRepository.findById(id).orElseThrow(() -> new TeamNotFoundException(id));
        System.out.println((team));
        return teamMapper.teamToTeamDTO(team);
    }

    //GET
    @Transactional
    @Override
    public List<TeamDTO> getTeamsByCityId(Long id) throws ApiException {
        List<Team> teams = teamRepository.findAll();
        List<TeamDTO> teamDTOS = teams.stream()
                .filter(team -> team.getCity() != null && team.getCity().getId().equals(id))
                .map(teamMapper::teamToTeamDTO)
                .collect(Collectors.toList());
        if (teamDTOS.isEmpty()) {
            throw new CityNotFoundException(id);
        }
        return teamDTOS;
    }

    //GET - Team Match History
    @Transactional
    @Override
    public List<TeamMatchHistoryDTO> getTeamMatchHistory(Long teamId) throws ApiException {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new TeamNotFoundException(teamId));
        
        List<TeamMatchHistoryDTO> history = new ArrayList<>();
        
        // Fetch matches directly from repository to avoid lazy loading issues
        List<Match> homeMatches = matchRepository.findByHomeTeamId(teamId);
        List<Match> awayMatches = matchRepository.findByAwayTeamId(teamId);
        
        // Process home matches
        for (Match match : homeMatches) {
            TeamMatchHistoryDTO dto = new TeamMatchHistoryDTO();
            dto.setDate(match.getDate());
            dto.setTime(match.getTime());
            if (match.getStadium() != null) {
                dto.setStadium(stadiumMapper.stadiumToStadiumDTO(match.getStadium()));
            }
            dto.setHomeGoals(match.getHomeGoals());
            dto.setAwayGoals(match.getAwayGoals());
            dto.setSpectators(match.getSpectators());
            if (match.getAwayTeam() != null) {
                dto.setOpponentName(match.getAwayTeam().getName());
            }
            dto.setHomeMatch(true);
            history.add(dto);
        }
        
        // Process away matches
        for (Match match : awayMatches) {
            TeamMatchHistoryDTO dto = new TeamMatchHistoryDTO();
            dto.setDate(match.getDate());
            dto.setTime(match.getTime());
            if (match.getStadium() != null) {
                dto.setStadium(stadiumMapper.stadiumToStadiumDTO(match.getStadium()));
            }
            dto.setHomeGoals(match.getHomeGoals());
            dto.setAwayGoals(match.getAwayGoals());
            dto.setSpectators(match.getSpectators());
            if (match.getHomeTeam() != null) {
                dto.setOpponentName(match.getHomeTeam().getName());
            }
            dto.setHomeMatch(false);
            history.add(dto);
        }
        
        // Sort by date (most recent first)
        history.sort((a, b) -> {
            if (b.getDate() == null || a.getDate() == null) {
                return 0;
            }
            int dateCompare = b.getDate().compareTo(a.getDate());
            if (dateCompare != 0) {
                return dateCompare;
            }
            // If same date, sort by time
            if (b.getTime() == null || a.getTime() == null) {
                return 0;
            }
            return b.getTime().compareTo(a.getTime());
        });
        
        return history;
    }

    @Transactional
    @Override
    public TeamDTO updateTeamById(Long id, TeamDTO teamDTO) throws ApiException {
        Optional<Team> teamOptional = teamRepository.findById(id);

        if (teamOptional.isPresent()) {
            Team existingTeam = teamOptional.get();

            // If objects ID are sent in JSON, set attributes via ID.


            if (teamDTO != null) {
                if(teamDTO.getName() != null){
                existingTeam.setName(teamDTO.getName());
                }
                if(teamDTO.getCity() != null){
                    if (teamDTO.getCity().getId() != null) {
                        CityDTO cityDTO = cityServiceImp.getCityById(teamDTO.getCity().getId());
                        existingTeam.setCity(cityMapper.cityDTOToCity(cityDTO));
                    } else if(teamDTO.getCity().getName() != null){
                        existingTeam.setCity(cityMapper.cityDTOToCity(cityServiceImp.createCity(teamDTO.getCity())));
                    }
                }
                if(teamDTO.getStadium() != null){
                    if (teamDTO.getStadium().getId() != null) {
                        StadiumDTO stadiumDTO = stadiumServiceImp.getStadiumById(teamDTO.getStadium().getId());
                        existingTeam.setStadium(stadiumMapper.stadiumDTOToStadium(stadiumDTO));
                    } else if(teamDTO.getStadium().getName() != null){
                        existingTeam.setStadium(stadiumMapper.stadiumDTOToStadium(stadiumServiceImp.createStadium(teamDTO.getStadium())));
                    }
                }
                if(teamDTO.getDivision() != null){
                    if (teamDTO.getDivision().getId() != null) {
                        DivisionDTO divisionDTO = divisionServiceImp.getDivisionById(teamDTO.getDivision().getId());
                        existingTeam.setDivision(divisionMapper.divisionDTOToDivision(divisionDTO));
                    } else if(teamDTO.getDivision().getName() != null){
                        existingTeam.setDivision(divisionMapper.divisionDTOToDivision(divisionServiceImp.createDivision(teamDTO.getDivision())));
                    }
                }


                return teamMapper.teamToTeamDTO(teamRepository.save(existingTeam));
            }
        }
        throw new TeamNotFoundException(id);

    }

    //DELETE
    @Transactional
    @Override
    public TeamDTO deleteTeamById(Long id) throws ApiException {
        //Verifies if team exists, if not, throws TeamNotFoundException
        Optional<Team> teamOptional = teamRepository.findById(id);
        if(teamOptional.isPresent()){
            //Deletes team from DB
            teamRepository.delete(teamOptional.get());
            return teamMapper.teamToTeamDTO(teamOptional.get());
        }
        throw new TeamNotFoundException(id);
    }

    //POST - Register Team with credentials
    @Transactional
    @Override
    public TeamDTO registerTeam(TeamRegisterDTO teamRegisterDTO) throws ApiException {
        // Validate input
        if (teamRegisterDTO.getUsername() == null || teamRegisterDTO.getUsername().trim().isEmpty()) {
            throw new TeamCredentialsAlreadyExist("username", "Username is required");
        }
        
        if (teamRegisterDTO.getUsername().trim().length() < 3) {
            throw new TeamCredentialsAlreadyExist("username", "Username must be at least 3 characters");
        }
        
        if (teamRegisterDTO.getEmail() == null || teamRegisterDTO.getEmail().trim().isEmpty()) {
            throw new TeamCredentialsAlreadyExist("email", "Email is required");
        }
        
        if (!teamRegisterDTO.getEmail().trim().contains("@")) {
            throw new TeamCredentialsAlreadyExist("email", "Invalid email format");
        }
        
        // Password is automatically set to username, so no password validation needed
        
        String username = teamRegisterDTO.getUsername().trim();
        String email = teamRegisterDTO.getEmail().trim().toLowerCase();
        
        // Check if username already exists
        if (teamRepository.existsByUsername(username)) {
            throw new TeamCredentialsAlreadyExist("username", username);
        }
        
        // Check if email already exists
        if (teamRepository.existsByEmail(email)) {
            throw new TeamCredentialsAlreadyExist("email", email);
        }
        
        // Check if team name already exists (only if name is provided)
        if (teamRegisterDTO.getName() != null && !teamRegisterDTO.getName().trim().isEmpty()) {
            Optional<Team> optionalTeam = teamRepository.findByName(teamRegisterDTO.getName().trim());
            if (optionalTeam.isPresent()) {
                throw new TeamAlreadyExist(teamRegisterDTO.getName());
            }
        }

        // Create team entity
        Team team = new Team();
        team.setName(teamRegisterDTO.getName() != null ? teamRegisterDTO.getName().trim() : null); // Can be null - will be set later
        team.setUsername(username);
        // Set password to match username
        team.setPassword(username); // Password equals username
        team.setEmail(email);

        // Set division, city, stadium (all optional during registration)
        if (teamRegisterDTO.getDivision() != null) {
            Division division;
            if (teamRegisterDTO.getDivision().getId() != null) {
                division = divisionMapper.divisionDTOToDivision(divisionServiceImp.getDivisionById(teamRegisterDTO.getDivision().getId()));
            } else {
                division = divisionMapper.divisionDTOToDivision(divisionServiceImp.createDivision(teamRegisterDTO.getDivision()));
            }
            team.setDivision(division);
        }

        if (teamRegisterDTO.getCity() != null) {
            City city;
            if (teamRegisterDTO.getCity().getId() != null) {
                city = cityMapper.cityDTOToCity(cityServiceImp.getCityById(teamRegisterDTO.getCity().getId()));
            } else {
                city = cityMapper.cityDTOToCity(cityServiceImp.createCity(teamRegisterDTO.getCity()));
            }
            team.setCity(city);
        }

        if (teamRegisterDTO.getStadium() != null) {
            Stadium stadium;
            if (teamRegisterDTO.getStadium().getId() != null) {
                stadium = stadiumMapper.stadiumDTOToStadium(stadiumServiceImp.getStadiumById(teamRegisterDTO.getStadium().getId()));
            } else {
                stadium = stadiumMapper.stadiumDTOToStadium(stadiumServiceImp.createStadium(teamRegisterDTO.getStadium()));
            }
            team.setStadium(stadium);
        }

        // Initialize empty lists
        List<Match> awayMatches = new ArrayList<>();
        List<Match> homeMatches = new ArrayList<>();
        List<Player> players = new ArrayList<>();
        team.setHomeMatches(homeMatches);
        team.setAwayMatches(awayMatches);
        team.setPlayers(players);

        // Save and return
        return teamMapper.teamToTeamDTO(teamRepository.save(team));
    }

    //POST - Login Team
    @Transactional
    @Override
    public TeamDTO loginTeam(TeamLoginDTO teamLoginDTO) throws ApiException {
        Optional<Team> teamOptional = teamRepository.findByUsername(teamLoginDTO.getUsername());
        
        if (teamOptional.isEmpty()) {
            throw new TeamLoginException("Invalid username or password");
        }
        
        Team team = teamOptional.get();
        
        // Compare passwords (trim whitespace and handle null)
        String storedPassword = team.getPassword() != null ? team.getPassword().trim() : "";
        String providedPassword = teamLoginDTO.getPassword() != null ? teamLoginDTO.getPassword().trim() : "";
        
        if (!storedPassword.equals(providedPassword)) {
            throw new TeamLoginException("Invalid username or password");
        }
        
        // Return team DTO without password
        TeamDTO teamDTO = teamMapper.teamToTeamDTO(team);
        teamDTO.setPassword(null); // Don't send password back
        return teamDTO;
    }

    //GET - Team Dashboard
    @Transactional
    @Override
    public TeamDashboardDTO getTeamDashboard(Long teamId) throws ApiException {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new TeamNotFoundException(teamId));
        
        // Get all match history
        List<TeamMatchHistoryDTO> allMatches = getTeamMatchHistory(teamId);
        
        LocalDate today = LocalDate.now();
        List<TeamMatchHistoryDTO> upcomingMatches = new ArrayList<>();
        List<TeamMatchHistoryDTO> pastMatches = new ArrayList<>();
        
        // Separate upcoming and past matches
        // Logic:
        // - Upcoming: Date is after today AND (scores are 0-0 OR not set)
        // - Past: Date is before today OR has non-zero scores (completed match)
        for (TeamMatchHistoryDTO match : allMatches) {
            if (match.getDate() == null) {
                continue;
            }
            
            boolean isDatePast = match.getDate().isBefore(today);
            boolean isDateToday = match.getDate().isEqual(today);
            boolean isDateFuture = match.getDate().isAfter(today);
            
            // Check if match has been played (has non-zero scores)
            boolean hasNonZeroScores = (match.getHomeGoals() > 0 || match.getAwayGoals() > 0);
            boolean isZeroZero = (match.getHomeGoals() == 0 && match.getAwayGoals() == 0);
            
            // Determine if match is past or upcoming
            if (isDatePast) {
                // Date is in past - always a past match
                pastMatches.add(match);
            } else if (isDateFuture && isZeroZero) {
                // Future date with 0-0 score - definitely upcoming
                upcomingMatches.add(match);
            } else if (isDateFuture && hasNonZeroScores) {
                // Future date but has scores - treat as past (played ahead of schedule)
                pastMatches.add(match);
            } else if (isDateToday && hasNonZeroScores) {
                // Today with scores - past match
                pastMatches.add(match);
            } else if (isDateToday && isZeroZero) {
                // Today with 0-0 - upcoming (scheduled for today, not played yet)
                upcomingMatches.add(match);
            } else {
                // Default: if future and 0-0, it's upcoming
                if (isDateFuture) {
                    upcomingMatches.add(match);
                } else {
                    pastMatches.add(match);
                }
            }
        }
        
        // Sort upcoming matches (earliest first)
        upcomingMatches.sort((a, b) -> {
            if (a.getDate() == null || b.getDate() == null) return 0;
            int dateCompare = a.getDate().compareTo(b.getDate());
            if (dateCompare != 0) return dateCompare;
            if (a.getTime() == null || b.getTime() == null) return 0;
            return a.getTime().compareTo(b.getTime());
        });
        
        // Hardcode upcoming matches for all teams
        if (team != null) {
            List<TeamMatchHistoryDTO> hardcodedMatches = getHardcodedUpcomingMatches(team);
            if (!hardcodedMatches.isEmpty()) {
                upcomingMatches.addAll(hardcodedMatches);
                
                // Re-sort after adding hardcoded matches
                upcomingMatches.sort((a, b) -> {
                    if (a.getDate() == null || b.getDate() == null) return 0;
                    int dateCompare = a.getDate().compareTo(b.getDate());
                    if (dateCompare != 0) return dateCompare;
                    if (a.getTime() == null || b.getTime() == null) return 0;
                    return a.getTime().compareTo(b.getTime());
                });
            }
        }
        
        // Calculate statistics from past matches
        int wins = 0;
        int losses = 0;
        int draws = 0;
        int goalsScored = 0;
        int goalsConceded = 0;
        
        for (TeamMatchHistoryDTO match : pastMatches) {
            int teamGoals = match.isHomeMatch() ? match.getHomeGoals() : match.getAwayGoals();
            int opponentGoals = match.isHomeMatch() ? match.getAwayGoals() : match.getHomeGoals();
            
            goalsScored += teamGoals;
            goalsConceded += opponentGoals;
            
            if (teamGoals > opponentGoals) {
                wins++;
            } else if (teamGoals < opponentGoals) {
                losses++;
            } else {
                draws++;
            }
        }
        
        int totalMatches = pastMatches.size();
        int points = (wins * 3) + draws;
        
        // Calculate percentages and averages
        double winPercentage = totalMatches > 0 ? (wins * 100.0) / totalMatches : 0.0;
        double averageGoalsScored = totalMatches > 0 ? (double) goalsScored / totalMatches : 0.0;
        double averageGoalsConceded = totalMatches > 0 ? (double) goalsConceded / totalMatches : 0.0;
        
        // Calculate current streak (last 5 matches)
        String currentStreak = calculateStreak(pastMatches);
        
        // Count players
        int totalPlayers = playerRepository.findByTeamId(teamId).size();
        
        // Create announcements list (placeholder for future implementation)
        List<String> announcements = new ArrayList<>();
        announcements.add("Welcome to your team dashboard!");
        if (upcomingMatches.size() > 0) {
            announcements.add("You have " + upcomingMatches.size() + " upcoming match(es).");
        }
        if (wins > 0 && totalMatches > 0) {
            announcements.add("Your team has won " + wins + " out of " + totalMatches + " matches!");
        }
        
        TeamDashboardDTO dashboard = new TeamDashboardDTO();
        dashboard.setTeamId(teamId);
        dashboard.setTeamName(team.getName() != null ? team.getName() : "Team");
        dashboard.setTotalMatches(totalMatches);
        dashboard.setWins(wins);
        dashboard.setLosses(losses);
        dashboard.setDraws(draws);
        dashboard.setGoalsScored(goalsScored);
        dashboard.setGoalsConceded(goalsConceded);
        dashboard.setPoints(points);
        dashboard.setUpcomingMatches(upcomingMatches);
        dashboard.setPastMatches(pastMatches);
        dashboard.setWinPercentage(Math.round(winPercentage * 10.0) / 10.0); // Round to 1 decimal
        dashboard.setAverageGoalsScored(Math.round(averageGoalsScored * 10.0) / 10.0);
        dashboard.setAverageGoalsConceded(Math.round(averageGoalsConceded * 10.0) / 10.0);
        dashboard.setCurrentStreak(currentStreak);
        dashboard.setTotalPlayers(totalPlayers);
        dashboard.setAnnouncements(announcements);
        
        return dashboard;
    }
    
    private String calculateStreak(List<TeamMatchHistoryDTO> pastMatches) {
        if (pastMatches.isEmpty()) {
            return "No matches yet";
        }
        
        // Get last 5 matches (they're already sorted most recent first)
        int streakLength = Math.min(5, pastMatches.size());
        StringBuilder streak = new StringBuilder();
        
        for (int i = 0; i < streakLength; i++) {
            TeamMatchHistoryDTO match = pastMatches.get(i);
            int teamGoals = match.isHomeMatch() ? match.getHomeGoals() : match.getAwayGoals();
            int opponentGoals = match.isHomeMatch() ? match.getAwayGoals() : match.getHomeGoals();
            
            if (teamGoals > opponentGoals) {
                streak.append("W");
            } else if (teamGoals < opponentGoals) {
                streak.append("L");
            } else {
                streak.append("D");
            }
            
            if (i < streakLength - 1) {
                streak.append("-");
            }
        }
        
        // Calculate consecutive wins/losses
        if (streakLength > 0) {
            TeamMatchHistoryDTO latest = pastMatches.get(0);
            int teamGoals = latest.isHomeMatch() ? latest.getHomeGoals() : latest.getAwayGoals();
            int opponentGoals = latest.isHomeMatch() ? latest.getAwayGoals() : latest.getHomeGoals();
            
            char result = teamGoals > opponentGoals ? 'W' : (teamGoals < opponentGoals ? 'L' : 'D');
            int consecutive = 1;
            
            for (int i = 1; i < streakLength; i++) {
                TeamMatchHistoryDTO match = pastMatches.get(i);
                int tGoals = match.isHomeMatch() ? match.getHomeGoals() : match.getAwayGoals();
                int oGoals = match.isHomeMatch() ? match.getAwayGoals() : match.getHomeGoals();
                char matchResult = tGoals > oGoals ? 'W' : (tGoals < oGoals ? 'L' : 'D');
                
                if (matchResult == result) {
                    consecutive++;
                } else {
                    break;
                }
            }
            
            String resultText = result == 'W' ? "Won" : (result == 'L' ? "Lost" : "Drew");
            return resultText + " " + consecutive + " (" + streak.toString() + ")";
        }
        
        return streak.toString();
    }
    
    private List<TeamMatchHistoryDTO> getHardcodedUpcomingMatches(Team team) {
        List<TeamMatchHistoryDTO> matches = new ArrayList<>();
        String teamName = team.getName();
        String username = team.getUsername();
        
        // Manchester United
        if ("Manchester United".equals(teamName) || "manchesterunited".equals(username)) {
            matches.add(createMatch(LocalDate.of(2026, 5, 1), LocalTime.of(15, 0), "Liverpool FC", true, new StadiumDTO(1L, "Old Trafford", 74310)));
            matches.add(createMatch(LocalDate.of(2026, 5, 15), LocalTime.of(17, 30), "Chelsea FC", false, new StadiumDTO(3L, "Stamford Bridge", 40341)));
            matches.add(createMatch(LocalDate.of(2026, 6, 1), LocalTime.of(16, 0), "Arsenal FC", true, new StadiumDTO(1L, "Old Trafford", 74310)));
            matches.add(createMatch(LocalDate.of(2026, 6, 10), LocalTime.of(20, 0), "Tottenham Hotspur", false, new StadiumDTO(6L, "Tottenham Hotspur Stadium", 62850)));
            matches.add(createMatch(LocalDate.of(2026, 7, 5), LocalTime.of(15, 0), "Manchester City", true, new StadiumDTO(1L, "Old Trafford", 74310)));
            matches.add(createMatch(LocalDate.of(2026, 7, 15), LocalTime.of(18, 0), "Newcastle United", false, new StadiumDTO(7L, "St. James' Park", 52305)));
        }
        // Liverpool FC
        else if ("Liverpool FC".equals(teamName) || "liverpoolfc".equals(username)) {
            matches.add(createMatch(LocalDate.of(2026, 5, 5), LocalTime.of(15, 0), "Manchester United", true, new StadiumDTO(2L, "Anfield", 53394)));
            matches.add(createMatch(LocalDate.of(2026, 5, 20), LocalTime.of(17, 30), "Arsenal FC", false, new StadiumDTO(4L, "Emirates Stadium", 60704)));
            matches.add(createMatch(LocalDate.of(2026, 6, 5), LocalTime.of(16, 0), "Chelsea FC", true, new StadiumDTO(2L, "Anfield", 53394)));
            matches.add(createMatch(LocalDate.of(2026, 6, 15), LocalTime.of(20, 0), "Manchester City", false, new StadiumDTO(5L, "Etihad Stadium", 53400)));
            matches.add(createMatch(LocalDate.of(2026, 7, 10), LocalTime.of(15, 0), "Tottenham Hotspur", true, new StadiumDTO(2L, "Anfield", 53394)));
            matches.add(createMatch(LocalDate.of(2026, 7, 20), LocalTime.of(18, 0), "Newcastle United", false, new StadiumDTO(7L, "St. James' Park", 52305)));
        }
        // Chelsea FC
        else if ("Chelsea FC".equals(teamName) || "chelseafc".equals(username)) {
            matches.add(createMatch(LocalDate.of(2026, 5, 3), LocalTime.of(15, 0), "Arsenal FC", true, new StadiumDTO(3L, "Stamford Bridge", 40341)));
            matches.add(createMatch(LocalDate.of(2026, 5, 18), LocalTime.of(17, 30), "Manchester United", false, new StadiumDTO(1L, "Old Trafford", 74310)));
            matches.add(createMatch(LocalDate.of(2026, 6, 3), LocalTime.of(16, 0), "Liverpool FC", false, new StadiumDTO(2L, "Anfield", 53394)));
            matches.add(createMatch(LocalDate.of(2026, 6, 12), LocalTime.of(20, 0), "Manchester City", true, new StadiumDTO(3L, "Stamford Bridge", 40341)));
            matches.add(createMatch(LocalDate.of(2026, 7, 8), LocalTime.of(15, 0), "Tottenham Hotspur", false, new StadiumDTO(6L, "Tottenham Hotspur Stadium", 62850)));
            matches.add(createMatch(LocalDate.of(2026, 7, 18), LocalTime.of(18, 0), "Brighton & Hove Albion", true, new StadiumDTO(3L, "Stamford Bridge", 40341)));
        }
        // Arsenal FC
        else if ("Arsenal FC".equals(teamName) || "arsenalfc".equals(username)) {
            matches.add(createMatch(LocalDate.of(2026, 5, 7), LocalTime.of(15, 0), "Chelsea FC", false, new StadiumDTO(3L, "Stamford Bridge", 40341)));
            matches.add(createMatch(LocalDate.of(2026, 5, 22), LocalTime.of(17, 30), "Liverpool FC", true, new StadiumDTO(4L, "Emirates Stadium", 60704)));
            matches.add(createMatch(LocalDate.of(2026, 6, 7), LocalTime.of(16, 0), "Manchester United", false, new StadiumDTO(1L, "Old Trafford", 74310)));
            matches.add(createMatch(LocalDate.of(2026, 6, 17), LocalTime.of(20, 0), "Manchester City", true, new StadiumDTO(4L, "Emirates Stadium", 60704)));
            matches.add(createMatch(LocalDate.of(2026, 7, 12), LocalTime.of(15, 0), "Tottenham Hotspur", true, new StadiumDTO(4L, "Emirates Stadium", 60704)));
            matches.add(createMatch(LocalDate.of(2026, 7, 22), LocalTime.of(18, 0), "Leicester City", false, new StadiumDTO(9L, "King Power Stadium", 32312)));
        }
        // Manchester City
        else if ("Manchester City".equals(teamName) || "manchestercity".equals(username)) {
            matches.add(createMatch(LocalDate.of(2026, 5, 4), LocalTime.of(15, 0), "Tottenham Hotspur", true, new StadiumDTO(5L, "Etihad Stadium", 53400)));
            matches.add(createMatch(LocalDate.of(2026, 5, 19), LocalTime.of(17, 30), "Liverpool FC", true, new StadiumDTO(5L, "Etihad Stadium", 53400)));
            matches.add(createMatch(LocalDate.of(2026, 6, 4), LocalTime.of(16, 0), "Chelsea FC", false, new StadiumDTO(3L, "Stamford Bridge", 40341)));
            matches.add(createMatch(LocalDate.of(2026, 6, 14), LocalTime.of(20, 0), "Arsenal FC", false, new StadiumDTO(4L, "Emirates Stadium", 60704)));
            matches.add(createMatch(LocalDate.of(2026, 7, 6), LocalTime.of(15, 0), "Manchester United", false, new StadiumDTO(1L, "Old Trafford", 74310)));
            matches.add(createMatch(LocalDate.of(2026, 7, 16), LocalTime.of(18, 0), "Newcastle United", true, new StadiumDTO(5L, "Etihad Stadium", 53400)));
        }
        // Tottenham Hotspur
        else if ("Tottenham Hotspur".equals(teamName) || "tottenhamhotspur".equals(username)) {
            matches.add(createMatch(LocalDate.of(2026, 5, 6), LocalTime.of(15, 0), "Manchester City", false, new StadiumDTO(5L, "Etihad Stadium", 53400)));
            matches.add(createMatch(LocalDate.of(2026, 5, 21), LocalTime.of(17, 30), "Arsenal FC", false, new StadiumDTO(4L, "Emirates Stadium", 60704)));
            matches.add(createMatch(LocalDate.of(2026, 6, 6), LocalTime.of(16, 0), "Liverpool FC", false, new StadiumDTO(2L, "Anfield", 53394)));
            matches.add(createMatch(LocalDate.of(2026, 6, 11), LocalTime.of(20, 0), "Manchester United", true, new StadiumDTO(6L, "Tottenham Hotspur Stadium", 62850)));
            matches.add(createMatch(LocalDate.of(2026, 7, 9), LocalTime.of(15, 0), "Chelsea FC", true, new StadiumDTO(6L, "Tottenham Hotspur Stadium", 62850)));
            matches.add(createMatch(LocalDate.of(2026, 7, 19), LocalTime.of(18, 0), "Aston Villa", false, new StadiumDTO(10L, "Villa Park", 42682)));
        }
        // Newcastle United
        else if ("Newcastle United".equals(teamName) || "newcastleunited".equals(username)) {
            matches.add(createMatch(LocalDate.of(2026, 5, 8), LocalTime.of(15, 0), "Brighton & Hove Albion", true, new StadiumDTO(7L, "St. James' Park", 52305)));
            matches.add(createMatch(LocalDate.of(2026, 5, 23), LocalTime.of(17, 30), "Leicester City", false, new StadiumDTO(9L, "King Power Stadium", 32312)));
            matches.add(createMatch(LocalDate.of(2026, 6, 8), LocalTime.of(16, 0), "Manchester United", true, new StadiumDTO(7L, "St. James' Park", 52305)));
            matches.add(createMatch(LocalDate.of(2026, 6, 18), LocalTime.of(20, 0), "Liverpool FC", true, new StadiumDTO(7L, "St. James' Park", 52305)));
            matches.add(createMatch(LocalDate.of(2026, 7, 11), LocalTime.of(15, 0), "Manchester City", false, new StadiumDTO(5L, "Etihad Stadium", 53400)));
            matches.add(createMatch(LocalDate.of(2026, 7, 21), LocalTime.of(18, 0), "Arsenal FC", true, new StadiumDTO(7L, "St. James' Park", 52305)));
        }
        // Brighton & Hove Albion
        else if ("Brighton & Hove Albion".equals(teamName) || "brightonhovealbion".equals(username)) {
            matches.add(createMatch(LocalDate.of(2026, 5, 2), LocalTime.of(15, 0), "Newcastle United", false, new StadiumDTO(7L, "St. James' Park", 52305)));
            matches.add(createMatch(LocalDate.of(2026, 5, 17), LocalTime.of(17, 30), "Leicester City", true, new StadiumDTO(8L, "Amex Stadium", 31800)));
            matches.add(createMatch(LocalDate.of(2026, 6, 2), LocalTime.of(16, 0), "Aston Villa", false, new StadiumDTO(10L, "Villa Park", 42682)));
            matches.add(createMatch(LocalDate.of(2026, 6, 13), LocalTime.of(20, 0), "Chelsea FC", false, new StadiumDTO(3L, "Stamford Bridge", 40341)));
            matches.add(createMatch(LocalDate.of(2026, 7, 4), LocalTime.of(15, 0), "Manchester United", true, new StadiumDTO(8L, "Amex Stadium", 31800)));
            matches.add(createMatch(LocalDate.of(2026, 7, 14), LocalTime.of(18, 0), "Liverpool FC", true, new StadiumDTO(8L, "Amex Stadium", 31800)));
        }
        // Leicester City
        else if ("Leicester City".equals(teamName) || "leicestercity".equals(username)) {
            matches.add(createMatch(LocalDate.of(2026, 5, 9), LocalTime.of(15, 0), "Aston Villa", true, new StadiumDTO(9L, "King Power Stadium", 32312)));
            matches.add(createMatch(LocalDate.of(2026, 5, 24), LocalTime.of(17, 30), "Newcastle United", true, new StadiumDTO(9L, "King Power Stadium", 32312)));
            matches.add(createMatch(LocalDate.of(2026, 6, 9), LocalTime.of(16, 0), "Brighton & Hove Albion", false, new StadiumDTO(8L, "Amex Stadium", 31800)));
            matches.add(createMatch(LocalDate.of(2026, 6, 19), LocalTime.of(20, 0), "Arsenal FC", true, new StadiumDTO(9L, "King Power Stadium", 32312)));
            matches.add(createMatch(LocalDate.of(2026, 7, 7), LocalTime.of(15, 0), "Manchester City", false, new StadiumDTO(5L, "Etihad Stadium", 53400)));
            matches.add(createMatch(LocalDate.of(2026, 7, 17), LocalTime.of(18, 0), "Chelsea FC", false, new StadiumDTO(3L, "Stamford Bridge", 40341)));
        }
        // Aston Villa
        else if ("Aston Villa".equals(teamName) || "astonvilla".equals(username)) {
            matches.add(createMatch(LocalDate.of(2026, 5, 10), LocalTime.of(15, 0), "Leicester City", false, new StadiumDTO(9L, "King Power Stadium", 32312)));
            matches.add(createMatch(LocalDate.of(2026, 5, 25), LocalTime.of(17, 30), "Brighton & Hove Albion", true, new StadiumDTO(10L, "Villa Park", 42682)));
            matches.add(createMatch(LocalDate.of(2026, 6, 20), LocalTime.of(16, 0), "Tottenham Hotspur", true, new StadiumDTO(10L, "Villa Park", 42682)));
            matches.add(createMatch(LocalDate.of(2026, 6, 16), LocalTime.of(20, 0), "Newcastle United", false, new StadiumDTO(7L, "St. James' Park", 52305)));
            matches.add(createMatch(LocalDate.of(2026, 7, 13), LocalTime.of(15, 0), "Manchester United", true, new StadiumDTO(10L, "Villa Park", 42682)));
            matches.add(createMatch(LocalDate.of(2026, 7, 23), LocalTime.of(18, 0), "Liverpool FC", false, new StadiumDTO(2L, "Anfield", 53394)));
        }
        
        return matches;
    }
    
    private TeamMatchHistoryDTO createMatch(LocalDate date, LocalTime time, String opponentName, 
                                            boolean isHomeMatch, StadiumDTO stadium) {
        TeamMatchHistoryDTO match = new TeamMatchHistoryDTO();
        match.setDate(date);
        match.setTime(time);
        match.setStadium(stadium);
        match.setHomeGoals(0);
        match.setAwayGoals(0);
        match.setOpponentName(opponentName);
        match.setHomeMatch(isHomeMatch);
        match.setSpectators(0);
        return match;
    }
}

