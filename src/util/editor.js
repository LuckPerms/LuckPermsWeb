export function contextsToArray(context) {
  if (Array.isArray(context)) {
    return context || [];
  }

  if (context) {
    return [context];
  }

  return [];
}

export function parseNodeType(key) {
  // inheritance: group.<group name>
  if (key.startsWith('group.')) {
    return {
      type: 'inheritance',
      groupName: key.substring(6),
    };
  }

  // prefix: prefix.<weight>.<prefix string>
  if (key.startsWith('prefix.')) {
    const parts = key.substring(7).match(/^(\d+)\.(.+)$/);
    if (parts) {
      return {
        type: 'prefix',
        weight: parts[1],
        prefix: parts[2],
      };
    }
  }

  // suffix: suffix.<weight>.<suffix string>
  if (key.startsWith('suffix.')) {
    const parts = key.substring(7).match(/^(\d+)\.(.+)$/);
    if (parts) {
      return {
        type: 'suffix',
        weight: parts[1],
        suffix: parts[2],
      };
    }
  }

  // meta: meta.<key>.<value>
  if (key.startsWith('meta.')) {
    const metaContent = key.substring(5);
    const dotIndex = metaContent.indexOf('.');
    if (dotIndex > 0) {
      return {
        type: 'meta',
        key: metaContent.substring(0, dotIndex),
        value: metaContent.substring(dotIndex + 1),
      };
    }
  }

  // weight: weight.<weight value>
  if (key.startsWith('weight.')) {
    return {
      type: 'weight',
      weight: key.substring(7),
    };
  }

  // display name: displayname.<display name>
  if (key.startsWith('displayname.')) {
    return {
      type: 'displayname',
      displayName: key.substring(12),
    };
  }

  // assume permission
  return {
    type: 'permission',
    permission: key,
  };
}

export function buildNodeKey(type, parts) {
  switch (type) {
    case 'group':
      return `group.${parts.groupName || ''}`;
    case 'prefix':
      return `prefix.${parts.weight || '0'}.${parts.prefix || ''}`;
    case 'suffix':
      return `suffix.${parts.weight || '0'}.${parts.suffix || ''}`;
    case 'meta':
      return `meta.${parts.key || ''}.${parts.value || ''}`;
    case 'weight':
      return `weight.${parts.weight || '0'}`;
    case 'displayname':
      return `displayname.${parts.displayName || ''}`;
    case 'permission':
    default:
      return parts.permission || '';
  }
}

