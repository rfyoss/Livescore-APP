<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Team extends Model
{
    protected $table = 'teams';

    protected $fillable = [
        'id',
        'name',
        'logo',
        'country',
        'founded',
        'venue'
    ];

    public $incrementing = false; // Using API-Football's ID as primary key

    /**
     * Relationship: Team has many players
     */
    public function players(): HasMany
    {
        return $this->hasMany(Player::class, 'team_id');
    }

    /**
     * Relationship: Team has many home matches
     */
    public function homeMatches(): HasMany
    {
        return $this->hasMany(Match::class, 'home_team_id');
    }

    /**
     * Relationship: Team has many away matches
     */
    public function awayMatches(): HasMany
    {
        return $this->hasMany(Match::class, 'away_team_id');
    }
}
