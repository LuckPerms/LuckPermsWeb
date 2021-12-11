export default {
  languages: 'Languages',

  description: 'A permissions plugin for Minecraft servers.',
  close: 'Close',
  copy: 'Copy',
  wiki: 'Wiki',
  avatar: '{name}\'s avatar',
  sponsor: 'Proudly sponsored by <strong>BisectHosting</strong><br/><span class="new">NEW:</span> Special offer for LuckPerms users!',
  links: {
    home: 'Home',
    download: 'Download',
    editor: 'Web Editor',
    verbose: 'Verbose Viewer',
    tree: 'Tree Viewer',
    wiki: 'Wiki',
    tools: {
      name: 'Tools',
      editor: 'Editor',
      verbose: 'Verbose',
      tree: 'Tree',
    },
  },
  home: {
    name: 'Home',
    supported: 'Supports Bukkit/Spigot/Paper, BungeeCord, Sponge, Fabric, Nukkit and Velocity servers',
    why: {
      title: 'Why LuckPerms?',
      description: 'LuckPerms is a permissions plugin for Minecraft servers. It allows server admins to control what features players can use by creating groups and assigning permissions.',
      its: 'It is:',
      fast: '<b>fast</b> - written with performance and scalability in mind.',
      reliable: '<b>reliable</b> - trusted by thousands of server admins, and the largest of server networks.',
      easy: '<b>easy to use</b> - setup permissions using commands, directly in config files, or using the web editor.',
      flexible: '<b>flexible</b> - supports a variety of data storage options, and works on lots of different server types.',
      extensive: '<b>extensive</b> - a plethora of customization options and settings which can be changed to suit your server.',
      free: '<b>free</b> - available for download and usage at no cost, and permissively licensed so it can remain free forever.',
      more: 'For more information, see the wiki article on {wiki}',
      why: 'Why LuckPerms?',
    },
    apps: {
      title: 'Web Apps',
      description1: 'This site hosts a number of extra web applications which work with the plugin.',
      description2: 'These applications are designed to work for all users, even those without the ability to install/host an application on their own web server.',
    },
    wiki: 'Learn how to install, setup, configure and effectively use LuckPerms',
    github: 'Browse the source code, report issues and contribute to the project',
    discord: 'Join {count} others to discuss the project and ask/answer questions',
    patreon: 'Join {count} others supporting the project on Patreon',
    partner: {
      title: 'Hosting Partner',
      description: 'Find out how you can get a great deal on your server hosting and support us at the same time',
    },
  },
  download: {
    title: 'Download LuckPerms',
    build: 'Latest, built {time}',
    typeHelp: 'Not sure which type?',
    typeChoose: 'Choose your server type',
    bukkit: 'Spigot, Paper etc. (1.8.8 to 1.18)',
    bungee: 'BungeeCord, Waterfall etc. (latest only)',
    sponge: 'SpongeForge & SpongeVanilla (API 5 to 7)',
    fabric: 'Fabric (1.18)',
    nukkit: 'NukkitX (b93 or newer)',
    velocity: 'Velocity (3.0.0 or newer)',
    bukkitLegacy: 'Spigot, Paper etc. (1.7.10 only)',
    changelog: 'Recent Changelog',
    install: {
      title: 'How to install',
      add: 'Add the downloaded plugin <code>.jar</code> file into your server\'s <code>plugins</code> or <code>mods</code> folder.',
      restart: 'Start or restart your server - <strong>do not reload!</strong>',
      config: 'Locate the plugin\'s configuration file (usually found within <code>/plugins/LuckPerms/</code>) and adjust any settings to your liking.',
      setup: 'Start setting up your permissions! Check out the {wiki} guide for more info.',
      wiki: 'Getting Started',
    },
    trouble: {
      title: 'Having trouble installing?',
      console: 'Make sure to check your console for any error messages - especially during start up',
      read: 'Check the more detailed {wiki} wiki page to see if you need to perform any additional steps.',
      wiki: 'Installation',
      support: 'If all else fails, get in touch with us on {discord} and we\'ll be happy to help.',
    },
    extensions: {
      title: 'Extensions',
      description: 'Extensions can modify the behaviour of LuckPerms, you can read more about them on {wiki}.',
      descriptionWiki: 'the wiki',
      legacy: 'Legacy API Extension',
      legacyInfo: 'Allows some common API methods to be used by plugins that haven\'t upgraded to v5 version of the API yet.',
      more: 'Check out the {wiki} for more information!',
      wiki: 'wiki section',
      wikiThis: 'this section',
      defaultAssignments: 'Default Assignments Extension',
      defaultAssignmentsInfo: 'Provides an alternate approach for assigning {wiki} if the recommended way is impractical.',
      defaultAssignmentsInfoMore: 'Check out the {wikiSection} for more information. See also {thisSection} about configuring default assignments.',
      groups: 'default groups',
      version: 'LuckPerms 5.0 and above',
    },
    additionalPlugins: {
      title: 'Additional Plugins',
      description: 'Additional plugins can provide more complex features, but may not be available on all platforms',
      extraContexts: 'ExtraContexts Plugin',
      extraContextsInfo: 'Add more contexts, including some for other plugins',
      version: 'LuckPerms 5.0 and above, Bukkit only',
    },
    placeholderExpansions: {
      title: 'Placeholder Expansions',
      description: 'LuckPerms adds {placeholders} to PlaceholderAPI and MVdWPlaceholderAPI',
      placeholderApi: 'PlaceholderAPI',
      placeholders: 'Placeholders',
      placeholderApiInfo: 'Install using either {command} or by {installingManually}.',
      placeholderApiInstallingManually: 'installing manually',
      mvdwPlaceholderApi: 'MVdWPlaceholderAPI',
      mvdwPlaceholderApiInfo: 'Place the JAR file in your {plugins} folder.',
      version: 'LuckPerms 5.0 and above, Bukkit only',
    },    
  },
  editor: {
    description: 'Web Permissions Editor',
    start: 'To start a new editor session, use one of the following commands:',
    loading: 'Loading data...',
    permissions: 'Permissions',
    key: 'Key',
    value: 'Value',
    expiry: 'Expiry',
    contexts: 'Contexts',
    search: 'Search',
    add: 'Add',
    copy: 'Copy',
    move: 'Move',
    replace: 'Replace',
    delete: 'Delete',
    cancel: 'Cancel',
    update: 'Update',
    save: 'Save',
    saveAndGenerate: 'Save and generate code',
    saving: 'Saving...',
    saved: 'Data was saved!',
    command: 'Run this command on your server to apply the changes:',
    copied: 'Command copied to clipboard',
    clipboardCopy: 'Copy to clipboard',
    clearFilters: 'Clear filter',
    noResults: 'No results found',
    applyNote: '<strong>Note:</strong> after running the <code>applyedits</code> command, you should generate another editor URL to continue editing your server\'s permissions.',
    nav: {
      tracks: 'Tracks',
      groups: 'Groups',
      users: 'Users',
    },
    groups: {
      create: 'Create a group',
      name: 'Group name',
      choose: 'Choose a group or user from the side bar',
      toggle: 'Show/hide groups',
      delete: 'Are you sure you want to delete group: <code>{group}</code>',
      deleteConfirm: 'All {count} of its permissions will be deleted. This currently can not be undone.',
      displayName: 'Display name',
      parent: 'Parent',
      weight: 'Weight',
      prefix: 'Prefix',
      suffix: 'Suffix',
      add: 'Add group',
      edit: 'Edit group',
      none: 'None',
    },
    users: {
      delete: 'Are you sure you want to delete user: {user}',
      deleteConfirm: 'All {count} of its permissions will be deleted. This currently can not be undone.',
      edit: 'Edit user',
      toggleUsers: 'Show/hide users',
    },
    nodes: {
      add: 'Add node',
      update: 'Update nodes',
      permissionsCount: 'Permission nodes <span>({count})</span>',
      addPermissions: 'Add permissions',
      addContext: 'Add context',
      addContexts: 'Add contexts',
      deselect: 'Deselect all nodes',
      select: 'Select node for mass operations',
      selectAll: 'Select node for mass operations',
      replace: 'Replace contexts instead of adding?',
      edit: 'Click to edit the permission',
      toggle: 'Click to toggle true/false',
      expiry: 'Click to choose an expiry',
      never: 'never',
      deleteExpiry: 'Delete expiry',
      contexts: 'Click to edit the contexts for this node',
      enter: 'Enter permissions or paste many',
      enterToSelect: 'Press enter to select',
      contextsCount: 'Contexts <span>({count})</span>',
      selected: '<span>{count}</span> selected node | <span>{count}</span> selected nodes',
      copy: 'Copy {count} node to... | Copy {count} nodes to...',
      move: 'Move {count} node to... | Move {count} nodes to...',
      delete: 'Delete {count} node? | Delete {count} nodes?',
      deleteConfirm: 'Are you sure you want to delete {count} permission node? | Are you sure you want to delete {count} permission nodes?',
      selection: {
        true: 'Change all values to TRUE',
        false: 'Change all values to FALSE',
        keep: 'Keep values unchanged',
      },
      sort: {
        permission: 'Sort nodes by permission',
        value: 'Sort nodes by true/false',
        expiry: 'Sort nodes by expiry',
        contexts: 'Sort nodes by contexts',
      },
    },
    tracks: {
      create: 'Create a track',
      groups: 'Groups',
      tip: 'Tip: click and drag to re-order the track',
      addGroups: 'Add groups',
      edit: 'Edit track',
      name: 'Track name',
      add: 'Add track',
      save: 'Save track',
      delete: 'Delete track',
      filter: 'Filter tracks, groups and users',
      toggle: 'Show/hide tracks',
      toggleGroups: 'Show/hide track groups',
    },
    meta: {
      add: 'Add a group to {id}',
      parents: 'Parent groups',
      weight: 'Weight: ',
      gotoParent: 'Go to the {parent} group',
      removeParent: 'Remove {parent} as a parent',
    },
    error: {
      title: 'Loading error',
      info: 'Either the URL was copied wrong or the session has expired.',
      new: 'Please generate another editor session with {command}.',
    },
    unsupported: {
      title: 'Unsupported version',
      info: 'Please {download} the latest version of LuckPerms to use the Web Editor',
      download: 'download',
    },
  },
  tree: {
    title: 'Permission Tree Viewer',
    generate: 'To generate a permission tree, do the following in game or from the console:',
    uploaded: 'Uploaded by',
    user: 'Reference user',
    time: 'Time',
    started: 'When the recording started',
    expand: 'Expand',
    collapse: 'Collapse',
    home: {
      generate: 'To generate a permission tree, do the following in game or from the console:',
      scope: 'scope',
      player: 'player',
      url: 'Follow the URL that is generated',
    },
  },
  verbose: {
    title: 'Verbose viewer',
    uploaded: 'Uploaded by',
    start: 'Start time',
    started: 'When the recording started',
    end: 'End time',
    ended: 'When the recording ended',
    duration: 'Duration',
    recording: 'How long the plugin was recording for',
    count: 'Count',
    values: 'How many values matched and how many checks were made in total',
    filter: 'Filter',
    filterLabel: 'Filter nodes by username or permission:',
    filterDesc: 'The string used to filter the output',
    truncated: 'Truncated',
    truncatedDesc: 'If the data was truncated (limited in size) when uploaded',
    filterPlaceholder: 'Enter filter here',
    context: 'Context',
    origin: 'Origin',
    processor: 'Processor',
    cause: 'Cause',
    thread: 'Thread',
    trace: 'Trace',
    home: {
      generate: 'To generate a verbose report, do the following in game or from the console:',
      performActions: 'Perform a series of actions that require permissions',
      filter: 'filter',
      url: 'Follow the URL that is generated',
    },
  },
  tools: {
    demo: 'View Demo',
  },
  quiz: {
    choose: 'Do you run a single server, or a network?',
    single: 'Single server',
    network: 'Network of servers',
    type: 'What type of server are you running?',
    note: 'Note: LuckPerms is still required on all backend servers.',
    version: 'What version of {serverType} are you running?',
    older: '{version} or older',
    newer: '{version} or newer',
    result: 'You need LuckPerms for {serverType}',
    resultLegacy: 'You need LuckPerms Legacy for {serverType}',
    travertine: 'Your version of BungeeCord is not supported, consider switching to Travertine if you want to use LuckPerms.',
    outdated: 'Your version of {serverType} is not supported, you must upgrade if you want to use LuckPerms.',
  },
  notFound: {
    title: 'Not found!',
    message: 'The page {path} doesn\'t exist',
  },
};
