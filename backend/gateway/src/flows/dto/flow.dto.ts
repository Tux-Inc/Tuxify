import {
    ArrayMaxSize,
    IsArray,
    IsBoolean,
    IsIn,
    IsObject,
    IsOptional,
    IsString,
    MaxLength,
    Validate,
    ValidateNested,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from "class-validator";
import { Type } from "class-transformer";
import { isProviderStepName } from "@tuxify/common";

/** A step name is also the NATS subject the flows service sends to: whitelist it. */
@ValidatorConstraint({ name: "providerStepName" })
class ProviderStepNameConstraint implements ValidatorConstraintInterface {
    validate(name: unknown, args: ValidationArguments): boolean {
        const step = args.object as FlowStepDto;
        return isProviderStepName(name, step.type);
    }

    defaultMessage(): string {
        return "name must be a provider action or reaction (provider.<google|github|microsoft>.<type>.<name>) matching the step type";
    }
}

export class FlowStepInputDto {
    @IsString()
    @MaxLength(100)
    name: string;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    title?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    placeholder?: string;

    @IsOptional()
    @IsBoolean()
    required?: boolean;

    @IsOptional()
    @IsString()
    @MaxLength(10000)
    value?: string;
}

export class FlowStepOutputDto {
    @IsString()
    @MaxLength(100)
    name: string;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    title?: string;
}

export class FlowStepDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    uuid?: string;

    @IsIn(["action", "reaction"])
    type: "action" | "reaction";

    @IsString()
    @MaxLength(200)
    @Validate(ProviderStepNameConstraint)
    name: string;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    title?: string;

    @IsOptional()
    @IsString()
    @MaxLength(2000)
    description?: string;

    /** Display data of the provider (name, image...), kept as sent by the frontend. */
    @IsOptional()
    @IsObject()
    service?: Record<string, unknown>;

    @IsArray()
    @ArrayMaxSize(50)
    @ValidateNested({ each: true })
    @Type(() => FlowStepInputDto)
    inputs: FlowStepInputDto[] = [];

    @IsOptional()
    @IsArray()
    @ArrayMaxSize(50)
    @ValidateNested({ each: true })
    @Type(() => FlowStepOutputDto)
    outputs?: FlowStepOutputDto[];
}

/**
 * Body of POST /flows and PUT /flows/:id. Undeclared fields (_id, userId, lastRun,
 * createdAt...) are stripped by the global ValidationPipe, so a client cannot set
 * them; the frontend still sends the whole flow and keeps working.
 */
export class FlowDto {
    @IsString()
    @MaxLength(100)
    name: string;

    @IsOptional()
    @IsString()
    @MaxLength(2000)
    description?: string;

    @IsOptional()
    @IsArray()
    @ArrayMaxSize(50)
    @ValidateNested({ each: true })
    @Type(() => FlowStepDto)
    data?: FlowStepDto[];

    @IsOptional()
    @IsBoolean()
    enabled?: boolean;

    @IsOptional()
    @IsBoolean()
    isValid?: boolean;
}
