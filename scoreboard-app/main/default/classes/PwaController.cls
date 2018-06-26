@RestResource(UrlMapping='/v1/games/')
global with sharing class PwaController {


    public String body { get; set; }
    public String sessionId { get; set; }

    public class PwaDto {
        Contact contact { get; set; }
        Game__c[] games { get; set; }

    }

    global class PwaScoreDto {
        Id Id { get; set; }
        Integer Quarter_1_Score_Team_1 { get; set; }
        Integer Quarter_1_Score_Team_2 { get; set; }
        Integer Quarter_2_Score_Team_1 { get; set; }
        Integer Quarter_2_Score_Team_2 { get; set; }
        Integer Quarter_3_Score_Team_1 { get; set; }
        Integer Quarter_3_Score_Team_2 { get; set; }
        Integer Quarter_4_Score_Team_1 { get; set; }
        Integer Quarter_4_Score_Team_2 { get; set; }

        Game__c toGame() {
            return new Game__c(
                    Id = this.Id,
                    Quarter_1_Score_Team_1__c = this.Quarter_1_Score_Team_1,
                    Quarter_2_Score_Team_1__c = this.Quarter_2_Score_Team_1,
                    Quarter_3_Score_Team_1__c = this.Quarter_3_Score_Team_1,
                    Quarter_4_Score_Team_1__c = this.Quarter_4_Score_Team_1,
                    Quarter_1_Score_Team_2__c = this.Quarter_1_Score_Team_2,
                    Quarter_2_Score_Team_2__c = this.Quarter_2_Score_Team_2,
                    Quarter_3_Score_Team_2__c = this.Quarter_3_Score_Team_2,
                    Quarter_4_Score_Team_2__c = this.Quarter_4_Score_Team_2
            );
        }
    }

    public PwaController() {
        StaticResource pwaResource = [
                SELECT
                        Body
                FROM
                        StaticResource
                WHERE
                        Name = 'pwasw'
        ];

        System.debug(pwaResource);

        this.body = pwaResource.Body.toString();

        this.sessionId = UserInfo.getSessionId();

        System.debug('end constructor');

    }


    @RemoteAction
    public static PwaDto verifyEmail(String email) {

        PwaDto dto = new PwaDto();

        Contact contact = [
                SELECT
                        Id,
                        Name,
                        Email
                From
                        Contact
                WHERE
                        Email = :email

                LIMIT 1
        ];

        dto.contact = contact;

        Game__c[] games = [
                SELECT
                        Date__c,
                        Id,
                        Name,
                        OwnerId,
                        Quarter_1_Score_Team_1__c,
                        Quarter_1_Score_Team_2__c,
                        Quarter_2_Score_Team_1__c,
                        Quarter_2_Score_Team_2__c,
                        Quarter_3_Score_Team_1__c,
                        Quarter_3_Score_Team_2__c,
                        Quarter_4_Score_Team_1__c,
                        Quarter_4_Score_Team_2__c,
                        RecordTypeId,
                        Sport__c,
                        Sport__r.Name,
                        SystemModstamp,
                        Team_1__c,
                        Team_1__r.Name,
                        Team_1_Total_Score__c,
                        Team_2__c,
                        Team_2__r.Name,
                        Team_2_Total_Score__c, (
                        SELECT
                                Id,
                                Highlight_Caption__c,
                                Name,
                                Picture__c,
                                Team__r.Name,
                                Game__c
                        FROM
                                Highlights__r
                )

                FROM
                        Game__c

        ];

        dto.games = games;
        return dto;
    }

    @RemoteAction
    public static Game__c submitGame(PwaScoreDto score) {

        Game__c game = score.toGame();

        update game;

        return game;
    }

    @HttpGet global static String getGame() {
        return 'Test;';
    }

    @HttpPut
    global static Game__c[] putGame(String scoresString) {
        System.debug('START: putGame');
        System.debug(scoresString);

        PwaScoreDto[] scores = (PwaScoreDto[]) JSON.deserialize(scoresString, PwaScoreDto[].class);
        System.debug(scores);
        
        Game__c[] games = new List<Game__c>();

        for (PwaScoreDto score : scores) {
            games.add(PwaController.submitGame(score));

        }

        return games;
    }
}