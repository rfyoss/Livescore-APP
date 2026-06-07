<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Player extends Model
{
    protected $table = 'players';

    protected $fillable = [
        'id',
        'team_id',
        'name',
        'age',
        'nationality',
        'position',
        'photo'
    ];

    public $incrementing = false;

    /**
     * Relationship: Player belongs to a Team
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'team_id');
    }
}
