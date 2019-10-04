/**
 * Created by brett on 6/5/18.
 */

public with sharing class PwaSwController {

    public String body { get; set; }

    public PwaSwController() {

        StaticResource pwaResource = [
                SELECT
                        Body,
                        BodyLength,
                        CacheControl,
                        ContentType,
                        CreatedById,
                        CreatedDate,
                        Description,
                        Id,
                        LastModifiedById,
                        LastModifiedDate,
                        Name,
                        NamespacePrefix,
                        SystemModstamp
                FROM StaticResource
                WHERE Name = 'pwasw'
        ];

        System.debug(pwaResource);

        this.body = pwaResource.Body.toString();

    }

}